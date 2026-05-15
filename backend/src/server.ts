import express from "express";
import cors from "cors";
import prisma from "./database/db";
import routes from "./routes/index";
import mqttService from "./services/MqttService";
import agendamentoService from "./services/AgendadorCronService";
import { IMqttEvent } from "./types/IMqtt";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const start = async () => {
  try {
    await prisma.$connect();

    mqttService.connect();

    mqttService.onEventReceived((mac: string, payload: IMqttEvent) => {
      console.log(`Evento recebido do dispositivo ${mac}:`, payload);
      //Chamar serviço para salvar o histórico e retirada do medicamento
    });

    // Inicia o monitoramento de horários
    agendamentoService.iniciar();

    app.listen(PORT, () => {
      console.log(` Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

start();
