import { z } from "zod";

/**
 * Schema para parámetros de ruta de perfil
 */
export const profileParamsSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export type ProfileParams = z.infer<typeof profileParamsSchema>;
