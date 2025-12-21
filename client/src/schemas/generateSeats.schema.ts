import { z } from "zod";

export const gridSchema = z.object({
  rows: z.number().int().min(3, "Rows must be at least 3").max(20, "Rows cannot exceed 20"),
  cols: z.number().int().min(3, "Columns must be at least 3").max(20, "Columns cannot exceed 20"),
});

export type GridInput = z.infer<typeof gridSchema>;
