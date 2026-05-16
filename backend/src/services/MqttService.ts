import mqtt, { MqttClient } from "mqtt";
import { IMqttEvent } from "../types/IMqtt";

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
      console.log("[MQTT] Conectado ao broker");

      this.client?.subscribe("dispositivo/+/evento", (err) => {
        if (!err) {
          console.log("[MQTT] Inscrito no tópico de eventos");
        } else {
          console.error(
            "[MQTT] Erro ao se inscrever no tópico de eventos:",
            err,
          );
        }
      });
    });

    this.client.on("message", (topic, message) => {
      this.handleMessage(topic, message.toString());
    });

    this.client.on("error", (err) => {
      console.error("[MQTT] Erro na conexão:", err);
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
      console.log(
        `[MQTT] Evento recebido do dispositivo ${macAddress}: ${message}`,
      );

      try {
        const evento: IMqttEvent = JSON.parse(message);
        //Chamar serviço para salvar o histórico e retirada do medicamento
        if (this.eventCallback) {
          this.eventCallback(macAddress, evento);
        }
      } catch (error) {
        console.error("[MQTT] Erro ao processar mensagem recebida:", error);
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
