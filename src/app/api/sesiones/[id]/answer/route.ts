import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth/session";
import {
  bankedScoreForCompletedStep,
  pointsForStep,
  resolveOutcomeAfterAnswer,
} from "@/lib/game/stateMachine";
import { finalizeSessionIfDone } from "@/lib/game/finalize";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const body = await request.json();
  const { participantId, optionKey } = body as {
    participantId?: string;
    optionKey?: "A" | "B" | "C" | "D";
  };

  if (!participantId || !optionKey) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const participant = await prisma.participant.findFirst({
    where: { id: participantId, sessionId },
  });

  if (!participant) {
    return NextResponse.json({ error: "Participante no encontrado" }, { status: 404 });
  }
  if (participant.status !== "ACTIVE") {
    return NextResponse.json({ error: "Este participante ya terminó su turno" }, { status: 400 });
  }

  const step = participant.currentStep + 1;
  const sessionQuestion = await prisma.sessionQuestion.findUnique({
    where: { participantId_step: { participantId, step } },
    include: { question: true },
  });

  if (!sessionQuestion) {
    return NextResponse.json({ error: "No hay pregunta pendiente" }, { status: 400 });
  }
  if (sessionQuestion.answeredOption) {
    return NextResponse.json({ error: "Esta pregunta ya fue respondida" }, { status: 400 });
  }

  const isCorrect = optionKey === sessionQuestion.question.correctOption;
  const levels = await prisma.prizeLevel.findMany();
  const outcome = resolveOutcomeAfterAnswer(step, isCorrect);

  await prisma.sessionQuestion.update({
    where: { id: sessionQuestion.id },
    data: { answeredOption: optionKey, isCorrect, answeredAt: new Date() },
  });

  const updateData: {
    currentStep?: number;
    status?: "ACTIVE" | "WON" | "LOST";
    score?: number;
  } = {};

  if (outcome === "ADVANCE") {
    updateData.currentStep = step;
  } else if (outcome === "WON") {
    updateData.currentStep = step;
    updateData.status = "WON";
    updateData.score = pointsForStep(15, levels);
  } else {
    updateData.status = "LOST";
    updateData.score = bankedScoreForCompletedStep(participant.currentStep, levels);
  }

  const updatedParticipant = await prisma.participant.update({
    where: { id: participantId },
    data: updateData,
  });

  if (outcome !== "ADVANCE") {
    await finalizeSessionIfDone(sessionId);
  }

  return NextResponse.json({
    outcome,
    isCorrect,
    correctOption: sessionQuestion.question.correctOption,
    participant: updatedParticipant,
  });
}
