export interface IMqttCommand {
  acao: "ABRIR" | "FECHAR" | "ABASTECER";
  compartimento: number;
  timestamp: string;
}

export interface IMqttEvent {
  evento:
    | "ABERTURA"
    | "FECHAMENTO"
    | "FECHAMENTO_ABASTECIMENTO"
    | "ABERTURA_ABASTECIMENTO";
  compartimento: number;
  timestamp: string;
  status: "SUCESSO" | "FALHA";
  mensagem?: string;
}
