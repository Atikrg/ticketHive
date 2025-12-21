import { z } from 'zod';

const gridSchema = z.object({
    rows: z.number().int().min(3).max(20),
    cols: z.number().int().min(3).max(20),
});


export default gridSchema;
