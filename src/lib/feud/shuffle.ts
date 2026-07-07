export interface FeudQuestionPoolItem {
  id: string;
}

/** Elige aleatoriamente `roundCount` preguntas distintas del banco activo. */
export function pickFeudRounds(
  pool: FeudQuestionPoolItem[],
  roundCount: number
): string[] {
  if (pool.length < roundCount) {
    throw new Error(
      `Solo hay ${pool.length} pregunta(s) activas; elige ${pool.length} rondas o agrega más preguntas en el banco.`
    );
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, roundCount).map((q) => q.id);
}
