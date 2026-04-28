// src/config/dashboardResumo.ts

export type ResumoItem = {
  label: string;
  value: number;
  icon: string;
  color: string;
  roles: ('aluno' | 'professor' | 'admin')[];
};

export const dashboardResumoConfig: ResumoItem[] = [
  {
    label: 'Alunos',
    value: 2,
    icon: 'account-group',
    color: '#4CAF50',
    roles: ['admin', 'professor'],
  },
  {
    label: 'Professores',
    value: 3,
    icon: 'school',
    color: '#FF9800',
    roles: ['admin', 'aluno'],
  },
  {
    label: 'Disciplinas',
    value: 3,
    icon: 'book-open-variant',
    color: '#2196F3',
    roles: ['admin', 'professor', 'aluno'],
  },
  {
    label: 'Boletins',
    value: 4,
    icon: 'file-document-outline',
    color: '#FF5722',
    roles: ['admin', ],
  },
];