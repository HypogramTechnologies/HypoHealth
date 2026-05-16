import mqtt, { MqttClient } from "mqtt";
import { IMqttEvent } from "../types/IMqtt";

class MqttService {
  private client: MqttClient | null = null;

  private eventCallback:
    | ((mac: string, payload: IMqttEvent) => void)
    | null = null;

  public connect() {
    const brokerUrl = process.env.MQTT_URL || "mqtt://mqtt:1883";

    this.client = mqtt.connect(brokerUrl, {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    });

    this.client.on("connect", () => {
      console.log("[MQTT] Conectado");

      this.client?.subscribe("dispositivo/+/evento");
    });

    this.client.on("message", (topic, message) => {
      const parts = topic.split("/");

      if (parts.length !== 3) return;

      const mac = parts[1];

      try {
        const payload: IMqttEvent = JSON.parse(message.toString());

        this.eventCallback?.(mac, payload);
      } catch (err) {
        console.error("[MQTT] erro parse:", err);
      }
    });
  }

  public onEventReceived(
    callback: (mac: string, payload: IMqttEvent) => void,
  ) {
    this.eventCallback = callback;
  }

  public publishCommand(mac: string, payload: object) {
    this.client?.publish(
      `dispositivo/${mac}/comando`,
      JSON.stringify(payload),
    );
  }
}

export default new MqttService();