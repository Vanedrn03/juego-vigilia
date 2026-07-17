import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { toRoundView } from "@/lib/feud/serialize";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const body = await request.json();
  const { roundId, team } = body as { roundId?: string; team?: "TEAM_A" | "TEAM_B" };

  if (!roundId || !team) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const round = await prisma.feudSessionRound.findFirst({
    where: { id: roundId, sessionId },
    include: { question: { include: { answers: true } } },
  });

  if (!round) {
    return NextResponse.json({ error: "Ronda no encontrada" }, { status: 404 });
  }
  if (round.phase !== "FACEOFF") {
    return NextResponse.json({ error: "Esta ronda ya no está en duelo" }, { status: 400 });
  }

  const updated = await prisma.feudSessionRound.update({
    where: { id: roundId },
    data: { controllingTeam: team, phase: "PLAYING" },
  });

  return NextResponse.json({
    round: toRoundView({ ...updated, question: round.question }),
  });
}
