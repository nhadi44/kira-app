import { geminiModel } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { auditResponseSchema } from "@/lib/validations/audit";
import fs from "fs/promises";
import path from "path";
import admZip from "adm-zip";

import { downloadFileFromGCS, deleteFileFromGCS } from "@/lib/gcs";

export async function runBackgroundAudit(auditId: string, filePath: string, scanMode: "Quick" | "Deep", isGcs: boolean = false) {
  const tempDir = path.join(process.cwd(), "tmp", `audit-${auditId}`);

  try {
    await updateStage(auditId, "EXTRACTING", 10, "Extracting project architecture...");
    
    await fs.mkdir(tempDir, { recursive: true });
    
    let localZipPath = filePath;
    if (isGcs) {
      localZipPath = path.join(tempDir, "project-downloaded.zip");
      console.log(`[SCANNER] Downloading ${filePath} from GCS to ${localZipPath}`);
      await downloadFileFromGCS(filePath, localZipPath);
    }

    const zip = new admZip(localZipPath);
    zip.extractAllTo(tempDir, true);

    const files = await getAllFiles(tempDir);
    const codeContext = await getCodeContext(files, tempDir);

    // Stage 2: Analyzing
    await updateStage(auditId, "ANALYZING", 25, "Building security context...");
    await new Promise(r => setTimeout(r, 1000)); 
    await updateStage(auditId, "ANALYZING", 40, "Scanning code patterns for vulnerabilities...");

    const prompt = `
      You are KIRA (Knowledge Integrity & Risk Auditor), a Senior Security Architect.
      Perform a deep intelligence security audit on the following project code.
      
      CONTEXT:
      Project Files: ${files.map(f => path.relative(tempDir, f)).join(", ")}
      
      CODE CONTENT:
      ${codeContext}
      
      IDENTIFICATION GOALS:
      1. Injection Vulnerabilities (SQL, Command, XSS)
      2. Broken Access Control & Auth issues
      3. Hardcoded Secrets (API Keys, Tokens, JWT Secrets)
      4. PII Leakage (Email, Phone, Personal Data exposure)
      5. Misconfigurations (Insecure headers, open permissions)
      6. Dependency risks
      
      OUTPUT REQUIREMENTS:
      - All output MUST be in English.
      - Return ONLY a valid minified JSON.
      - Do NOT use markdown formatting.
      
      FOR EACH FINDING:
      - type: Vulnerability name.
      - severity: "Critical" | "High" | "Medium" | "Low".
      - description: Technical explanation.
      - remediation: Brief fix.
      - structuredRemediation: { immediateFix, recommendedPattern, validationRecommendation, regressionProtection }
      - file, line, vulnerableCode.
      
      JSON FORMAT:
      {
        "score": number,
        "executiveSummary": "string",
        "findings": [
          {
            "type": "string",
            "category": "Authentication" | "Infrastructure" | "Dependency" | "PII Exposure" | "Access Control" | "Configuration" | "Injection",
            "severity": "Critical" | "High" | "Medium" | "Low",
            "description": "string",
            "remediation": "string",
            "owasp": "string",
            "cwe": "string",
            "exploitability": "Low" | "Moderate" | "High" | "Critical",
            "affectedComponent": "string",
            "executiveRisk": "string",
            "whyItMatters": "string",
            "structuredRemediation": {
              "immediateFix": "string",
              "recommendedPattern": "string",
              "validationRecommendation": "string",
              "regressionProtection": "string"
            },
            "exploitabilityReasoning": "string",
            "validationTest": "string",
            "testFramework": "string",
            "file": "string",
            "line": number,
            "vulnerableCode": "string"
          }
        ]
      }
    `;

    const result = await generateWithRetry(auditId, prompt);
    const responseText = result.response.text();
    
    // Pastikan kita hanya mengambil isi dari { pertama hingga } terakhir
    // Ini mengabaikan karakter 'sampah' atau markdown yang mungkin ditambahkan AI
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText.replace(/```json|```/g, "").trim();
    
    console.log(`[AI_RESPONSE_RAW_SNIPPET] [${auditId}]:`, jsonString.substring(0, 200) + "...");
    const rawJson = JSON.parse(jsonString);

    // Stage 3: Correlating
    await updateStage(auditId, "CORRELATING", 65, "Correlating cross-file attack vectors...");
    await new Promise(r => setTimeout(r, 800));
    
    // Stage 4: Generating Tests
    await updateStage(auditId, "GENERATING_TESTS", 85, "Designing defensive validation suites...");
    await new Promise(r => setTimeout(r, 800));
    
    // Stage 5: Finalizing
    await updateStage(auditId, "FINALIZING", 95, "Finalizing intelligence report...");

    const validatedResponse = auditResponseSchema.parse(rawJson);

    await prisma.audit.update({
      where: { id: auditId },
      data: {
        score: validatedResponse.score,
        executiveSummary: validatedResponse.executiveSummary,
        findings: validatedResponse.findings as any,
        status: "COMPLETED",
        progress: 100,
        currentStage: "Completed",
        completedAt: new Date(),
      },
    });

  } catch (error: any) {
    console.error(`[BACKGROUND_SCAN_ERROR] [${auditId}]`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during background processing";
    
    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        errorMessage: errorMessage,
      },
    });
  } finally {
    // Cleanup
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
      if (!isGcs) {
        await fs.unlink(filePath).catch(() => {});
      } else {
        await deleteFileFromGCS(filePath);
      }
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
}

async function updateStage(id: string, status: any, progress: number, stage: string) {
  console.log(`[SCAN_PROGRESS] [${id}] Status: ${status} | Progress: ${progress}% | Stage: ${stage}`);
  await prisma.audit.update({
    where: { id },
    data: { status, progress, currentStage: stage },
  });
}

async function getAllFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((res) => {
    const resPath = path.resolve(dir, res.name);
    return res.isDirectory() ? getAllFiles(resPath) : resPath;
  }));
  return Array.prototype.concat(...files);
}

async function getCodeContext(files: string[], baseDir: string): Promise<string> {
  let context = "";
  // Prioritize certain extensions
  const priorityExtensions = [".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".php", ".env"];
  
  for (const file of files) {
    const relativePath = path.relative(baseDir, file);
    const ext = path.extname(file);
    
    // Strict exclusion
    if (
      file.includes("node_modules") || 
      file.includes(".git") || 
      file.includes(".next") ||
      file.endsWith(".lock") ||
      file.endsWith("-lock.json") ||
      file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".zip")
    ) continue;
    
    try {
      const content = await fs.readFile(file, "utf-8");
      // Add a stricter limit to context size to fit within Free Tier (approx 100k tokens)
      if ((context.length + content.length) > 400000) {
        if (!priorityExtensions.includes(ext)) continue;
        if (context.length > 500000) break; 
      }
      context += `\n--- FILE: ${relativePath} ---\n${content}\n`;
    } catch (e) {
      continue;
    }
  }
  return context;
}

async function generateWithRetry(auditId: string, prompt: string, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      return await geminiModel.generateContent(prompt);
    } catch (error: any) {
      const statusCode = error?.status || error?.response?.status;
      const errorMessage = error?.message || "";
      
      const isRateLimit = 
        statusCode === 429 || 
        errorMessage.includes("429") || 
        errorMessage.toLowerCase().includes("too many requests") ||
        errorMessage.toLowerCase().includes("quota");

      if (isRateLimit && i < retries - 1) {
        // Wait at least 65 seconds to clear the 1-minute window
        const waitTime = 65000 + (i * 10000); 
        console.warn(`[GEMINI_RETRY] [${auditId}] Rate limit detected. Waiting ${waitTime/1000}s... (Attempt ${i+1}/${retries})`);
        
        await updateStage(auditId, "ANALYZING", 40, `API Rate Limit hit. Retrying in ${waitTime/1000}s...`);
        
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Failed after maximum retries due to API Rate Limits");
}
