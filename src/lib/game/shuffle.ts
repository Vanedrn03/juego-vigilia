export const LADDER_SIZE = 15;

export interface QuestionPoolItem {
  id: string;
  difficulty: number;
}

/** Elige aleatoriamente una pregunta distinta para cada nivel (1..LADDER_SIZE) de la escalera. */
export function pickLadderForParticipant(
  pool: QuestionPoolItem[],
  usedQuestionIds: Set<string> = new Set()
): string[] {
  const byDifficulty = new Map<number, QuestionPoolItem[]>();
  for (const q of pool) {
    if (!byDifficulty.has(q.difficulty)) byDifficulty.set(q.difficulty, []);
    byDifficulty.get(q.difficulty)!.push(q);
  }

  const chosen: string[] = [];
  for (let step = 1; step <= LADDER_SIZE; step++) {
    const candidates = (byDifficulty.get(step) ?? []).filter(
      (q) => !usedQuestionIds.has(q.id)
    );
    const source = candidates.length > 0 ? candidates : byDifficulty.get(step) ?? [];
    if (source.length === 0) {
      throw new Error(
        `No hay preguntas activas con dificultad ${step} para armar la escalera. Agrega más preguntas en el banco.`
      );
    }
    const picked = source[Math.floor(Math.random() * source.length)];
    chosen.push(picked.id);
    usedQuestionIds.add(picked.id);
  }
  return chosen;
}
