
export type UserRole = 'aluno' | 'professor' | 'admin';

export interface Usuario {
    usuarioId: string;
    usuarioLogin?: string;
    usuarioSenha?: string;
    usuarioNome: string;
    usuarioEmail?: string;
    usuarioTelefone?: string;
    usuarioRole: UserRole;

}