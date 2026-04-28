import mqtt from "mqtt";

const brokerUrl = process.env.MQTT_URL || "mqtt://mqtt:1883";

export const connectMqtt = () => {
  const client = mqtt.connect(brokerUrl, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
  });

  client.on("connect", () => {
    console.log("Conectado ao broker MQTT");

    client.subscribe("hypohealth/alertas", (err) => {
      if (!err) {
        console.log("Inscrito no tópico de alertas");
      } else {
        console.error("Erro ao se inscrever no tópico de alertas:", err);
      }
    });
  });

  client.on("message", (topic, message) => {
    console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
  });

  client.on("error", (err) => {
    console.error("Erro na conexão MQTT:", err);
  });
};
