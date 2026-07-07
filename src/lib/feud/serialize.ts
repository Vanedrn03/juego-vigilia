import type { FeudRoundView, FeudSessionView } from "./types";

type AnswerRow = { id: string; text: string; points: number; rank: number };

type RoundRow = {
  id: string;
  roundNumber: number;
  phase: string;
  controllingTeam: string | null;
  strikes: number;
  pot: number;
  wonBy: string | null;
  revealedAnswerIds: unknown;
  question: { text: string; answers: AnswerRow[] };
};

type SessionRow = {
  id: string;
  status: string;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  rounds: RoundRow[];
};

function toRoundView(round: RoundRow): FeudRoundView {
  const revealedIds = new Set((round.revealedAnswerIds as string[] | null) ?? []);
  const showAll = round.phase === "DONE";

  const answers = [...round.question.answers]
    .sort((a, b) => a.rank - b.rank)
    .map((a) => {
      const revealed = showAll || revealedIds.has(a.id);
      return {
        id: a.id,
        rank: a.rank,
        revealed,
        text: revealed ? a.text : null,
        points: revealed ? a.points : null,
      };
    });

  return {
    id: round.id,
    roundNumber: round.roundNumber,
    phase: round.phase as FeudRoundView["phase"],
    controllingTeam: round.controllingTeam as FeudRoundView["controllingTeam"],
    strikes: round.strikes,
    pot: round.pot,
    wonBy: round.wonBy as FeudRoundView["wonBy"],
    questionText: round.question.text,
    answers,
  };
}

/**
 * Nunca enviar al cliente el texto/puntos de una respuesta no revelada,
 * ni el contenido de rondas futuras (más allá de la ronda actual).
 */
export function toPublicFeudSession(session: SessionRow): FeudSessionView {
  const sorted = [...session.rounds].sort((a, b) => a.roundNumber - b.roundNumber);
  const currentIndex = sorted.findIndex((r) => r.phase !== "DONE");
  const visible = currentIndex === -1 ? sorted : sorted.slice(0, currentIndex + 1);

  return {
    id: session.id,
    status: session.status as FeudSessionView["status"],
    teamAName: session.teamAName,
    teamBName: session.teamBName,
    teamAScore: session.teamAScore,
    teamBScore: session.teamBScore,
    rounds: visible.map(toRoundView),
  };
}
