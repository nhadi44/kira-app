"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";
import { auditSchema, auditResponseSchema, ScanMode, AuditInput } from "@/lib/validations/audit";
import { storage } from "@/lib/storage";
import { runBackgroundAudit } from "@/lib/jobs/scanner";
import fs from "fs/promises";
import path from "path";

async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  return await prisma.user.upsert({
    where: { clerkId: user.id },
    update: { email: user.emailAddresses[0].emailAddress },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
  });
}

import { generateV4UploadSignedUrl } from "@/lib/gcs";

export async function getUploadUrl(filename: string, contentType: string = "application/zip") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  // Make filename unique
  const uniqueFilename = `${userId}/${Date.now()}-${filename}`;
  const url = await generateV4UploadSignedUrl(uniqueFilename, contentType);
  
  return { url, uniqueFilename };
}

export async function processProjectAudit(formData: FormData) {
  const { userId } = await auth();
  console.log(`[AUDIT_START] Initiating project scan for user: ${userId}`);
  if (!userId) throw new Error("Unauthorized");

  const projectName = formData.get("projectName") as string;
  const scanMode = (formData.get("scanMode") as ScanMode) || "Deep";
  const gcsFilename = formData.get("gcsFilename") as string;

  if (!gcsFilename || !projectName) {
    return { error: "Missing required fields" };
  }

  await syncUser();

  try {
    const audit = await prisma.audit.create({
      data: {
        userId,
        projectName,
        status: "QUEUED",
        startedAt: new Date(),
      },
    });

    // Run in background using Next.js 15 'after'
    after(async () => {
      await runBackgroundAudit(audit.id, gcsFilename, scanMode, true);
      revalidatePath("/dashboard/ledger");
    });

    return { success: true, auditId: audit.id };

  } catch (error) {
    console.error("[PROJECT_AUDIT_ERROR]", error);
    return { error: "Failed to initialize security scan center. Please try again." };
  }
}

export async function processAudit(input: AuditInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validatedInput = auditSchema.parse(input);
  await syncUser();

  const audit = await prisma.audit.create({
    data: {
      userId,
      projectName: validatedInput.projectName,
      status: "PENDING",
    },
  });

  try {
    const prompt = `
      Lakukan analisis keamanan pada kode berikut:
      ${input.codeSnippet}
      
      Berikan output dalam valid JSON minified saja.
      Jangan gunakan markdown.
      
      FORMAT:
      {
        "score": number,
        "executiveSummary": "AI-generated professional summary",
        "findings": [
          {
            "type": string,
            "severity": "Critical" | "High" | "Medium" | "Low",
            "description": string,
            "remediation": string,
            "vulnerableCode": string,
            "confidence": "High" | "Medium" | "Low",
            "attackScenario": string,
            "category": string
          }
        ]
      }
    `;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const rawJson = JSON.parse(jsonString);

    const validatedResponse = auditResponseSchema.parse(rawJson);

    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        score: validatedResponse.score,
        executiveSummary: validatedResponse.executiveSummary,
        findings: validatedResponse.findings as any,
        status: "COMPLETED",
      },
    });

    revalidatePath("/dashboard/ledger");
    return { success: true, auditId: audit.id };

  } catch (error) {
    console.error("[AUDIT_ERROR]", error);
    await prisma.audit.update({
      where: { id: audit.id },
      data: { status: "FAILED" },
    });
    return { error: "Failed to process audit" };
  }
}
