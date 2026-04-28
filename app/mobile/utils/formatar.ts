export const formatar = {
  // Formata 12345678 para 12345-678
  cep: (value: string) => {
    return value
      .replace(/\D/g, "") 
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  },

  // Garante e-mail em minúsculas e remove espaços
  email: (value: string) => {
    return value.toLowerCase().trim();
  },

  // Formata (11) 99999-9999 ou (11) 8888-8888
  telefone: (value: string) => {
    const r = value.replace(/\D/g, "");
    if (r.length > 10) {
      return r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
      return r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      return r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else if (r.length > 0) {
      return r.replace(/^(\d*)/, "($1");
    }
    return r;
  },

  // Formata 12345678901 para 123.456.789-01
  cpf: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  },

  // Capitaliza a primeira letra de cada nome (útil para AlunoNome)
  nomeProprio: (value: string) => {
    return value
      .toLowerCase()
      .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
  }
};