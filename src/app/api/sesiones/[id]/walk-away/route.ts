import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { pointsForStep } from "@/lib/game/stateMachine";
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
  const { participantId } = body as { participantId?: string };

  if (!participantId) {
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

  const levels = await prisma.prizeLevel.findMany();
  const score = pointsForStep(participant.currentStep, levels);

  const updatedParticipant = await prisma.participant.update({
    where: { id: participantId },
    data: { status: "WALKED_AWAY", score },
  });

  await finalizeSessionIfDone(sessionId);

  return NextResponse.json({ participant: updatedParticipant });
}
