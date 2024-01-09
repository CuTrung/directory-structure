import { z } from 'zod';

export const createAuthSchema = z
  .object({
    username: z.string(),
    password: z.string().min(5),
  })
  .required();

export type CreateAuthDto = z.infer<typeof createAuthSchema>;
