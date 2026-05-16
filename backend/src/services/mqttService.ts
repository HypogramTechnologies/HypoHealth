import mqtt from "mqtt";
import { MedicationIntakeService }
from "./MedicationIntakeService";

const brokerUrl =
  process.env.MQTT_URL || "mqtt://mqtt:1883";

const medicationIntakeService =
  new MedicationIntakeService();

export const connectMqtt = () => {

  const client = mqtt.connect(brokerUrl, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
  });

  client.on("connect", () => {

    console.log("Conectado ao broker MQTT");

    client.subscribe("hypohealth/alertas", (err) => {

      if (!err) {

        console.log(
          "Inscrito no tópico de alertas"
        );

      } else {

        console.error(
          "Erro ao se inscrever:",
          err
        );

      }

    });

  });

  client.on(
    "message",
    async (topic, message) => {

      try {

        const payload = JSON.parse(
          message.toString()
        );

        console.log(
          `Mensagem recebida no tópico ${topic}:`,
          payload
        );

        switch (payload.evento) {

          case "MEDICAMENTO_RETIRADO":

            await medicationIntakeService
              .processarRetirada(payload);

            break;

          default:

            console.log(
              "Evento desconhecido"
            );

        }

      } catch (error) {

        console.error(
          "Erro ao processar mensagem MQTT:",
          error
        );

      }

    }
  );

  client.on("error", (err) => {

    console.error("Erro MQTT:", err);

  });

};