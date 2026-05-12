import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { id } = await params;

    const audit = await prisma.audit.findUnique({
      where: { id },
      select: {
        status: true,
        progress: true,
        currentStage: true,
        projectName: true,
        errorMessage: true,
        userId: true,
      },
    });

    if (!audit) {
      return new Response(JSON.stringify({ error: "Not Found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (audit.userId !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { 
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(audit), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error(`[API_STATUS_CRITICAL_ERROR] [${id}]:`, error);
    return new Response(JSON.stringify({ error: error.message || "Internal Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
