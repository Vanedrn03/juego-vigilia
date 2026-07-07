import { z } from "zod";

export const feudAnswerSchema = z.object({
  text: z.string().trim().min(1, "Falta el texto de la respuesta"),
  points: z.coerce.number().int().min(1, "Los puntos deben ser mayores a 0"),
});

export const feudQuestionSchema = z.object({
  text: z.string().trim().min(5, "La pregunta es muy corta"),
  active: z.coerce.boolean().default(true),
  answers: z
    .array(feudAnswerSchema)
    .min(3, "Necesitas al menos 3 respuestas")
    .max(8, "Máximo 8 respuestas"),
});

export type FeudQuestionInput = z.infer<typeof feudQuestionSchema>;
