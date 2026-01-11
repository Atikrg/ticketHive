import { z } from 'zod';

export const layoutSchema = z.object({
    rows: z.number().int().min(3, "Rows must be at least 3").max(20, "Rows must be at most 20"),
    cols: z.number().int().min(3, "Columns must be at least 3").max(20, "Columns must be at most 20"),
});

