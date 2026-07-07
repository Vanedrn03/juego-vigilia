import type { FeudPhase, FeudTeamKey } from "./types";

export const MAX_STRIKES = 3;

export function oppositeTeam(team: FeudTeamKey): FeudTeamKey {
  return team === "TEAM_A" ? "TEAM_B" : "TEAM_A";
}

export type RevealOutcome =
  | { type: "CONTINUE" }
  | { type: "ROUND_WON"; wonBy: FeudTeamKey };

/** Qué pasa al revelar una respuesta correcta, según la fase actual de la ronda. */
export function resolveRevealOutcome(
  phase: FeudPhase,
  controllingTeam: FeudTeamKey,
  allAnswersRevealed: boolean
): RevealOutcome {
  if (phase === "STEAL") {
    return { type: "ROUND_WON", wonBy: oppositeTeam(controllingTeam) };
  }
  if (allAnswersRevealed) {
    return { type: "ROUND_WON", wonBy: controllingTeam };
  }
  return { type: "CONTINUE" };
}

export type StrikeOutcome =
  | { type: "STRIKE_ADDED" }
  | { type: "MOVE_TO_STEAL" }
  | { type: "ROUND_WON"; wonBy: FeudTeamKey };

/** Qué pasa al marcar un strike (respuesta incorrecta), según la fase actual. */
export function resolveStrikeOutcome(
  phase: FeudPhase,
  controllingTeam: FeudTeamKey,
  strikesAfter: number,
  anyAnswerUnrevealed: boolean
): StrikeOutcome {
  if (phase === "STEAL") {
    return { type: "ROUND_WON", wonBy: controllingTeam };
  }
  if (strikesAfter >= MAX_STRIKES) {
    if (anyAnswerUnrevealed) {
      return { type: "MOVE_TO_STEAL" };
    }
    return { type: "ROUND_WON", wonBy: controllingTeam };
  }
  return { type: "STRIKE_ADDED" };
}
