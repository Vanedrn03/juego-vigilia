import { z } from "zod";

export const newFeudSessionSchema = z.object({
  teamAName: z.string().trim().min(1, "Falta el nombre del equipo 1"),
  teamBName: z.string().trim().min(1, "Falta el nombre del equipo 2"),
  roundCount: z.coerce.number().int().min(1).max(15),
});

export type NewFeudSessionInput = z.infer<typeof newFeudSessionSchema>;
