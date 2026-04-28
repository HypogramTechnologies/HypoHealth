import { z } from 'zod';


export const loginSchema = z.object({
  usuarioLogin: z
    .string()
    .min(2, 'Login é obrigatório e deve ter pelo menos 2 caracteres'),
  usuarioSenha: z
    .string()
    .min(6, 'Senha é obrigatória e deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;