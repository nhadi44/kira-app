import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ReportClient } from "@/components/dashboard/ReportClient";
import { auth } from "@clerk/nextjs/server";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) return null;

  const audit = await prisma.audit.findUnique({
    where: { id, userId },
  });

  if (!audit) notFound();

  return <ReportClient audit={audit as any} />;
}
