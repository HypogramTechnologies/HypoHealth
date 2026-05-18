#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Stepper.h>
#include <ArduinoJson.h>

//////////////////////////////////////////////////
// WIFI
//////////////////////////////////////////////////

const char* ssid = "Gilson";
const char* password = "Alpha0Delta";


//////////////////////////////////////////////////
// MQTT
//////////////////////////////////////////////////

const char* mqtt_user = "Hypogram"; 
const char* mqtt_pass = "MinhaSenha123!";

const char* mqtt_server = "9047749c8e904e73bc5ba2d8fce67b59.s1.eu.hivemq.cloud"; 
const int mqtt_port = 8883; // Porta para placas/IoT (MQTT sobre TLS)

WiFiClientSecure espClient;
PubSubClient client(espClient);

//////////////////////////////////////////////////
// MOTOR DE PASSO
//////////////////////////////////////////////////

const int stepsPerRevolution = 2048;

Stepper motor(
  stepsPerRevolution,
  17,
  5,
  18,
  19
);

const int passosPorCompartimento = 256;

int compartimentoAtual = 0;

//////////////////////////////////////////////////
// BUZZER
//////////////////////////////////////////////////

const int buzzerPin = 13;

//////////////////////////////////////////////////
// SENSOR PIR
//////////////////////////////////////////////////

const int pirPin = 33;

//////////////////////////////////////////////////
// CONTROLE
//////////////////////////////////////////////////

bool aguardandoPresenca = false;
bool remedioTomado = false;

unsigned long tempoDeteccao = 0;
unsigned long tempoRetorno = 0;

int compartimentoAberto = 0;

//////////////////////////////////////////////////
// WIFI
//////////////////////////////////////////////////

void setupWifi() {
  delay(10);

  Serial.println();
  Serial.print("Conectando WiFi ");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi conectado!");
  Serial.println(WiFi.localIP());
}

//////////////////////////////////////////////////
// BEEP
//////////////////////////////////////////////////

void tocarBuzzer() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(buzzerPin, HIGH);
    delay(300);

    digitalWrite(buzzerPin, LOW);
    delay(300);
  }
}

//////////////////////////////////////////////////
// MOVER MOTOR
//////////////////////////////////////////////////

void moverParaCompartimento(int destino) {

  int diferenca = destino - compartimentoAtual;

  int passos = diferenca * passosPorCompartimento;

  Serial.print("Movendo para compartimento ");
  Serial.println(destino);

  motor.step(passos);

  compartimentoAtual = destino;
}

//////////////////////////////////////////////////
// VOLTAR POSIÇÃO INICIAL
//////////////////////////////////////////////////

void voltarInicio() {

  Serial.println("Voltando posição inicial");

  int diferenca = 0 - compartimentoAtual;

  int passos = diferenca * passosPorCompartimento;

  motor.step(passos);

  compartimentoAtual = 0;
}

//////////////////////////////////////////////////
// PUBLICAR HISTÓRICO
//////////////////////////////////////////////////

void publicarHistorico(int compartimento) {

  StaticJsonDocument<200> doc;

  doc["compartimento"] = compartimento;
  doc["status"] = "tomado";

  char buffer[256];

  serializeJson(doc, buffer);

  client.publish(
    "hypohealth/historico",
    buffer
  );

  Serial.println("Histórico enviado");
}

//////////////////////////////////////////////////
// RECEBER MQTT
//////////////////////////////////////////////////

void callback(char* topic, byte* payload, unsigned int length) {

  String mensagem;

  for (int i = 0; i < length; i++) {
    mensagem += (char)payload[i];
  }

  Serial.println("Mensagem recebida:");
  Serial.println(mensagem);

  StaticJsonDocument<200> doc;

  DeserializationError error =
    deserializeJson(doc, mensagem);

  if (error) {
    Serial.println("Erro JSON");
    return;
  }

  int compartimento =
    doc["compartimento"];

  if (compartimento < 0 || compartimento > 7) {
    Serial.println("Compartimento inválido");
    return;
  }

  tocarBuzzer();

  moverParaCompartimento(compartimento);

  compartimentoAberto = compartimento;

  aguardandoPresenca = true;
  remedioTomado = false;
}

//////////////////////////////////////////////////
// RECONECTAR MQTT
//////////////////////////////////////////////////


void reconnect() {

  while (!client.connected()) {

    Serial.print("Conectando MQTT...");

    String clientId = "ESP32_HypoHealth-";
    clientId += String(random(1000));

    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {

      Serial.println(" conectado!");

      client.subscribe("hypohealth/alertas");
    }

    else {

      Serial.print(" erro=");
      Serial.println(client.state());

      delay(2000);
    }
  }
}

//////////////////////////////////////////////////
// SETUP
//////////////////////////////////////////////////

void setup() {

  Serial.println("INICIANDO HYPOHEALTH");

  Serial.begin(115200);

  pinMode(buzzerPin, OUTPUT);

  pinMode(pirPin, INPUT);

  motor.setSpeed(10);

  setupWifi();

  espClient.setInsecure();

  client.setServer(mqtt_server, mqtt_port);

  client.setCallback(callback);

  Serial.println("Sistema iniciado");
  Serial.println(WiFi.macAddress());
}

//////////////////////////////////////////////////
// LOOP
//////////////////////////////////////////////////

void loop() {

  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  //////////////////////////////////////////////////
  // DETECTAR PRESENÇA
  //////////////////////////////////////////////////

  if (aguardandoPresenca && !remedioTomado) {

    int presenca = digitalRead(pirPin);

    if (presenca == HIGH) {

      Serial.println("Pessoa detectada");

      remedioTomado = true;

      tempoRetorno = millis();

      publicarHistorico(compartimentoAberto);
    }
  }

  //////////////////////////////////////////////////
  // VOLTAR APÓS 5 MIN
  //////////////////////////////////////////////////

  if (remedioTomado) {

    if (millis() - tempoRetorno >= 10000) {

      voltarInicio();

      remedioTomado = false;
      aguardandoPresenca = false;
    }
  }
}