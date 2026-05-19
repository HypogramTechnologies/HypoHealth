import express from "express";
import cors from "cors";
import prisma from "./database/db";
import routes from "./routes/index";

import mqttService from "./services/MqttService";
import agendadorCronService from "./services/AgendadorCronService";
import { MedicationIntakeService } from "./services/MedicationIntakeService";
import { IMqttEvent } from "./types/IMqtt";
import { logger } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const medicationIntakeService = new MedicationIntakeService();

const start = async () => {
  try {
    await prisma.$connect();

    mqttService.connect();

    mqttService.onEventReceived(async (mac: string, payload: IMqttEvent) => {
      await medicationIntakeService.processarRetirada(payload, mac);
    });

    agendadorCronService.iniciar();

    app.listen(PORT, () => {
      logger.info(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Erro ao iniciar o servidor: ${String(error)}`);
    process.exit(1);
  }
};

start();
