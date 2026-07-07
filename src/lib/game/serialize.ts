import type { GameSessionView, SessionQuestionView } from "./types";

type SessionQuestionWithQuestion = {
  id: string;
  step: number;
  answeredOption: string | null;
  isCorrect: boolean | null;
  revealedFiftyOptions: unknown;
  question: {
    id: string;
    text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    verseRef: string | null;
    correctOption: string;
  };
};

/** Nunca enviar la opción correcta al cliente para preguntas todavía sin responder. */
export function toPublicSessionQuestion(
  sq: SessionQuestionWithQuestion
): SessionQuestionView {
  const answered = sq.answeredOption !== null;
  return {
    id: sq.id,
    step: sq.step,
    answeredOption: sq.answeredOption as SessionQuestionView["answeredOption"],
    isCorrect: sq.isCorrect,
    revealedFiftyOptions: (sq.revealedFiftyOptions as string[] | null) ?? null,
    question: {
      id: sq.question.id,
      text: sq.question.text,
      optionA: sq.question.optionA,
      optionB: sq.question.optionB,
      optionC: sq.question.optionC,
      optionD: sq.question.optionD,
      verseRef: sq.question.verseRef,
      correctOption: answered
        ? (sq.question.correctOption as QuestionView["correctOption"])
        : null,
    },
  };
}

type QuestionView = SessionQuestionView["question"];

type ParticipantWithQuestions = {
  id: string;
  name: string;
  order: number;
  score: number;
  currentStep: number;
  status: string;
  lifelineFiftyUsed: boolean;
  lifelineLeaderUsed: boolean;
  lifelineTeamUsed: boolean;
  sessionQuestions: SessionQuestionWithQuestion[];
};

export function toPublicSession(session: {
  id: string;
  mode: string;
  status: string;
  participants: ParticipantWithQuestions[];
}): GameSessionView {
  return {
    id: session.id,
    mode: session.mode as GameSessionView["mode"],
    status: session.status as GameSessionView["status"],
    participants: session.participants.map((p) => ({
      id: p.id,
      name: p.name,
      order: p.order,
      score: p.score,
      currentStep: p.currentStep,
      status: p.status as GameSessionView["participants"][number]["status"],
      lifelineFiftyUsed: p.lifelineFiftyUsed,
      lifelineLeaderUsed: p.lifelineLeaderUsed,
      lifelineTeamUsed: p.lifelineTeamUsed,
      // Nunca enviar preguntas futuras (más allá de la próxima pendiente) para
      // que nadie pueda ver el contenido por adelantado inspeccionando la página.
      sessionQuestions: p.sessionQuestions
        .filter((sq) => sq.step <= p.currentStep + 1)
        .sort((a, b) => a.step - b.step)
        .map(toPublicSessionQuestion),
    })),
  };
}
