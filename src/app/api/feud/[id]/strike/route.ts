import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { resolveStrikeOutcome } from "@/lib/feud/stateMachine";
import { finalizeFeudSessionIfDone } from "@/lib/feud/finalize";
import { toRoundView } from "@/lib/feud/serialize";
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
  const { roundId } = body as { roundId?: string };

  if (!roundId) {
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
    return NextResponse.json({ error: "Esta ronda no acepta strikes ahora" }, { status: 400 });
  }
  if (!round.controllingTeam) {
    return NextResponse.json({ error: "La ronda no tiene equipo con control" }, { status: 400 });
  }

  const controllingTeam = round.controllingTeam as FeudTeamKey;
  const revealedIds = new Set((round.revealedAnswerIds as string[] | null) ?? []);
  const anyUnrevealed = revealedIds.size < round.question.answers.length;
  const strikesAfter = round.strikes + 1;

  const outcome = resolveStrikeOutcome(round.phase, controllingTeam, strikesAfter, anyUnrevealed);

  if (outcome.type === "STRIKE_ADDED") {
    const updated = await prisma.feudSessionRound.update({
      where: { id: roundId },
      data: { strikes: strikesAfter },
    });
    return NextResponse.json({
      round: toRoundView({ ...updated, question: round.question }),
    });
  }

  if (outcome.type === "MOVE_TO_STEAL") {
    const updated = await prisma.feudSessionRound.update({
      where: { id: roundId },
      data: { strikes: strikesAfter, phase: "STEAL" },
    });
    return NextResponse.json({
      round: toRoundView({ ...updated, question: round.question }),
    });
  }

  const updated = await prisma.feudSessionRound.update({
    where: { id: roundId },
    data: {
      strikes: round.phase === "PLAYING" ? strikesAfter : round.strikes,
      phase: "DONE",
      wonBy: outcome.wonBy,
    },
  });

  const scoreField = outcome.wonBy === "TEAM_A" ? "teamAScore" : "teamBScore";
  await prisma.feudSession.update({
    where: { id: sessionId },
    data: { [scoreField]: { increment: round.pot } },
  });

  await finalizeFeudSessionIfDone(sessionId);

  return NextResponse.json({
    round: toRoundView({ ...updated, question: round.question }),
  });
}
