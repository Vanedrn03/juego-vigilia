import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { resolveRevealOutcome } from "@/lib/feud/stateMachine";
import { finalizeFeudSessionIfDone } from "@/lib/feud/finalize";
import type { FeudTeamKey } from "@/lib/feud/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const body = await request.json();
  const { roundId, answerId } = body as { roundId?: string; answerId?: string };

  if (!roundId || !answerId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const round = await prisma.feudSessionRound.findFirst({
    where: { id: roundId, sessionId },
    include: { question: { include: { answers: true } } },
  });

  if (!round) {
    return NextResponse.json({ error: "Ronda no encontrada" }, { status: 404 });
  }
  if (round.phase !== "PLAYING" && round.phase !== "STEAL") {
    return NextResponse.json({ error: "Esta ronda no acepta respuestas ahora" }, { status: 400 });
  }
  if (!round.controllingTeam) {
    return NextResponse.json({ error: "La ronda no tiene equipo con control" }, { status: 400 });
  }

  const answer = round.question.answers.find((a) => a.id === answerId);
  if (!answer) {
    return NextResponse.json({ error: "Respuesta inválida" }, { status: 400 });
  }

  const revealedIds = new Set((round.revealedAnswerIds as string[] | null) ?? []);
  if (revealedIds.has(answerId)) {
    return NextResponse.json({ error: "Esa respuesta ya fue revelada" }, { status: 400 });
  }
  revealedIds.add(answerId);

  const newPot = round.pot + answer.points;
  const allRevealed = revealedIds.size >= round.question.answers.length;
  const outcome = resolveRevealOutcome(round.phase, round.controllingTeam as FeudTeamKey, allRevealed);

  if (outcome.type === "CONTINUE") {
    const updated = await prisma.feudSessionRound.update({
      where: { id: roundId },
      data: { revealedAnswerIds: Array.from(revealedIds), pot: newPot },
    });
    return NextResponse.json({ round: updated });
  }

  const updated = await prisma.feudSessionRound.update({
    where: { id: roundId },
    data: {
      revealedAnswerIds: Array.from(revealedIds),
      pot: newPot,
      phase: "DONE",
      wonBy: outcome.wonBy,
    },
  });

  const scoreField = outcome.wonBy === "TEAM_A" ? "teamAScore" : "teamBScore";
  await prisma.feudSession.update({
    where: { id: sessionId },
    data: { [scoreField]: { increment: newPot } },
  });

  await finalizeFeudSessionIfDone(sessionId);

  return NextResponse.json({ round: updated });
}
