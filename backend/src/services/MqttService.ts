import mqtt, { MqttClient } from "mqtt";
import { IMqttEvent } from "../types/IMqtt";
import { logger } from "../utils/logger";

class MqttService {
  private client: MqttClient | null = null;
  private eventCallback: ((mac: string, payload: IMqttEvent) => void) | null =
    null;

  public connect() {
    const brokerUrl = process.env.MQTT_URL || "mqtt://mqtt:1883";
    this.client = mqtt.connect(brokerUrl, {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    });

    this.client.on("connect", () => {
      logger.info("[MQTT] Conectado ao broker");

      this.client?.subscribe("dispositivo/+/evento", (err) => {
        if (!err) {
          logger.info("[MQTT] Inscrito no tópico de eventos");
        } else {
          logger.error(
            `[MQTT] Erro ao se inscrever no tópico de eventos: ${String(err)}`,
          );
        }
      });
    });

    this.client.on("message", (topic, message) => {
      this.handleMessage(topic, message.toString());
    });

    this.client.on("error", (err) => {
      logger.error(`[MQTT] Erro na conexão: ${String(err)}`);
    });
  }

  public handleMessage(topic: string, message: string) {
    const parts = topic.split("/");
    if (
      parts.length === 3 &&
      parts[0] === "dispositivo" &&
      parts[2] === "evento"
    ) {
      const macAddress = parts[1];

      try {
        const evento: IMqttEvent = JSON.parse(message);
        if (this.eventCallback) {
          this.eventCallback(macAddress, evento);
        }
      } catch (error) {
        logger.error(
          `[MQTT] Erro ao processar mensagem recebida: ${String(error)}`,
        );
      }
    }
  }

  public publishCommand(macAddress: string, payload: object) {
    if (!this.client?.connected) return;
    const topic = `dispositivo/${macAddress}/comando`;
    this.client.publish(topic, JSON.stringify(payload));
  }

  public onEventReceived(callback: (mac: string, payload: IMqttEvent) => void) {
    this.eventCallback = callback;
  }
}

export default new MqttService();
