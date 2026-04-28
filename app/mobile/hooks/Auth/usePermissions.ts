import { useAuth } from '../Auth/useAuth';

export function usePermissions() {
  const { user } = useAuth();

  return {
    role: user?.usuarioRole,

    isAluno: user?.usuarioRole === 'aluno',
    isProfessor: user?.usuarioRole === 'professor',
    isAdmin: user?.usuarioRole === 'admin',

    hasRole: (roles: Array<'aluno' | 'professor' | 'admin'>) => {
      return user ? roles.includes(user.usuarioRole) : false;
    },
  };
}