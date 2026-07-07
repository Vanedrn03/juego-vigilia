import { LADDER_SIZE } from "./shuffle";

export interface PrizeLevelLike {
  step: number;
  points: number;
  isCheckpoint: boolean;
}

/** Puntos otorgados por completar exactamente este nivel. */
export function pointsForStep(step: number, levels: PrizeLevelLike[]): number {
  const level = levels.find((l) => l.step === step);
  return level?.points ?? 0;
}

/** Puntos garantizados si el participante falla o se retira habiendo completado `completedStep` niveles. */
export function bankedScoreForCompletedStep(
  completedStep: number,
  levels: PrizeLevelLike[]
): number {
  const checkpoints = levels
    .filter((l) => l.isCheckpoint && l.step <= completedStep)
    .sort((a, b) => b.step - a.step);
  return checkpoints[0]?.points ?? 0;
}

export function isLastStep(step: number): boolean {
  return step >= LADDER_SIZE;
}

export type TurnOutcome = "ADVANCE" | "WON" | "LOST" | "WALKED_AWAY";

export function resolveOutcomeAfterAnswer(
  currentStep: number,
  isCorrect: boolean
): TurnOutcome {
  if (!isCorrect) return "LOST";
  return isLastStep(currentStep) ? "WON" : "ADVANCE";
}
