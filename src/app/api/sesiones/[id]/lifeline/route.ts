import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth/session";

type LifelineKey = "FIFTY" | "LEADER" | "TEAM";

const FLAG_BY_LIFELINE: Record<LifelineKey, "lifelineFiftyUsed" | "lifelineLeaderUsed" | "lifelineTeamUsed"> = {
  FIFTY: "lifelineFiftyUsed",
  LEADER: "lifelineLeaderUsed",
  TEAM: "lifelineTeamUsed",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const body = await request.json();
  const { participantId, lifeline } = body as {
    participantId?: string;
    lifeline?: LifelineKey;
  };

  if (!participantId || !lifeline || !FLAG_BY_LIFELINE[lifeline]) {
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

  const flag = FLAG_BY_LIFELINE[lifeline];
  if (participant[flag]) {
    return NextResponse.json({ error: "Ese comodín ya fue usado" }, { status: 400 });
  }

  const step = participant.currentStep + 1;
  const sessionQuestion = await prisma.sessionQuestion.findUnique({
    where: { participantId_step: { participantId, step } },
    include: { question: true },
  });

  if (!sessionQuestion) {
    return NextResponse.json({ error: "No hay pregunta pendiente" }, { status: 400 });
  }

  let revealedFiftyOptions: string[] | null = null;

  if (lifeline === "FIFTY") {
    const wrongOptions = (["A", "B", "C", "D"] as const).filter(
      (o) => o !== sessionQuestion.question.correctOption
    );
    const keptWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    revealedFiftyOptions = [sessionQuestion.question.correctOption, keptWrong].sort();

    await prisma.sessionQuestion.update({
      where: { id: sessionQuestion.id },
      data: { revealedFiftyOptions },
    });
  }

  const updatedParticipant = await prisma.participant.update({
    where: { id: participantId },
    data: { [flag]: true },
  });

  return NextResponse.json({ participant: updatedParticipant, revealedFiftyOptions });
}
