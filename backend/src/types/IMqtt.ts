export interface IMqttCommand {
  acao: "ABRIR" | "FECHAR";
  compartimento: number;
  timestamp: string;
}

export interface IMqttEvent {
  evento: "ABERTURA" | "FECHAMENTO";
  compartimento: number;
  timestamp: string;
  status: "SUCESSO" | "FALHA";
  mensagem?: string;
}
