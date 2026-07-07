import { z } from "zod";

export const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export const CATEGORIES = [
  "ANTIGUO_TESTAMENTO",
  "NUEVO_TESTAMENTO",
  "PERSONAJES",
  "DOCTRINA",
  "VIDA_DE_JESUS",
  "GENERAL",
] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  ANTIGUO_TESTAMENTO: "Antiguo Testamento",
  NUEVO_TESTAMENTO: "Nuevo Testamento",
  PERSONAJES: "Personajes",
  DOCTRINA: "Doctrina",
  VIDA_DE_JESUS: "Vida de Jesús",
  GENERAL: "General",
};

export const questionSchema = z.object({
  text: z.string().trim().min(5, "La pregunta es muy corta"),
  optionA: z.string().trim().min(1, "Falta la opción A"),
  optionB: z.string().trim().min(1, "Falta la opción B"),
  optionC: z.string().trim().min(1, "Falta la opción C"),
  optionD: z.string().trim().min(1, "Falta la opción D"),
  correctOption: z.enum(OPTION_KEYS),
  difficulty: z.coerce.number().int().min(1).max(15),
  category: z.enum(CATEGORIES),
  bibleVersion: z.string().trim().min(1).default("RV60"),
  verseRef: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  verseText: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  active: z.coerce.boolean().default(true),
});

export type QuestionInput = z.infer<typeof questionSchema>;
