import { z } from "zod";
import { CATEGORIES } from "./question";

export const newSessionSchema = z
  .object({
    mode: z.enum(["TEAMS", "INDIVIDUAL"]),
    participantAName: z.string().trim().min(1, "Falta el nombre del equipo/jugador 1"),
    participantBName: z.string().trim().min(1, "Falta el nombre del equipo/jugador 2"),
    categories: z.array(z.enum(CATEGORIES)).min(1, "Elige al menos una categoría"),
    minDifficulty: z.coerce.number().int().min(1).max(15).default(1),
    maxDifficulty: z.coerce.number().int().min(1).max(15).default(15),
  })
  .refine((data) => data.minDifficulty <= data.maxDifficulty, {
    message: "La dificultad mínima no puede ser mayor que la máxima",
    path: ["minDifficulty"],
  });

export type NewSessionInput = z.infer<typeof newSessionSchema>;
