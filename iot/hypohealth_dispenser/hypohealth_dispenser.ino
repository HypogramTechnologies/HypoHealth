#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Stepper.h>
#include <ArduinoJson.h>
#include "time.h"
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
const int mqtt_port = 8883; 


WiFiClientSecure espClient;
PubSubClient client(espClient);

//////////////////////////////////////////////////
// MOTOR
//////////////////////////////////////////////////
const int stepsPerRevolution = 2048;
// Pinos corretos: 25, 27, 26, 14
Stepper motor(stepsPerRevolution, 25, 27, 26, 14);

const int passosPorCompartimento = 256;
int compartimentoAtual = 0;
const int totalCompartimentos = 8;

int passosRestantes = 0;
int direcaoMotor = 0;

unsigned long ultimoMovimento = 0;
const unsigned long COOLDOWN_MOTOR = 3000;
bool retornoSolicitado = false;

void desligarMotor() {
  digitalWrite(25, LOW);
  digitalWrite(26, LOW);
  digitalWrite(27, LOW);
  digitalWrite(14, LOW);
}

void prepararMovimento(int destino) {
  int diferenca = destino - compartimentoAtual;

  if (diferenca > totalCompartimentos / 2) diferenca -= totalCompartimentos;
  else if (diferenca < -totalCompartimentos / 2) diferenca += totalCompartimentos;

  int passos = diferenca * passosPorCompartimento;

  passosRestantes = abs(passos);
  direcaoMotor = (passos > 0) ? 1 : -1;
  compartimentoAtual = destino;
}

void gerenciarMotorAsincrono() {
  if (passosRestantes > 0) {
    motor.step(direcaoMotor);
    passosRestantes--; // 🔥 CORREÇÃO: Faltava decrementar os passos!
    ultimoMovimento = millis();
  } else {
    // Desenergiza o motor quando parado
    if (millis() - ultimoMovimento > COOLDOWN_MOTOR) {
      desligarMotor();
    }
  }
}

void voltarInicio() {
  if (retornoSolicitado) return;
  retornoSolicitado = true;
  prepararMovimento(0);
}

//////////////////////////////////////////////////
// BUZZER (Trocado para porta 19 por segurança)
//////////////////////////////////////////////////
const int buzzerPin = 19; 

#define NOTE_E7 2637
#define NOTE_C7 2093
#define NOTE_G7 3136
#define NOTE_G6 1568

void tocarNota(int freq, int duracao) {
  ledcWriteTone(buzzerPin, freq);
  delay(duracao);
  ledcWriteTone(buzzerPin, 0);
  delay(50);
}

void tocarMario() {
  tocarNota(NOTE_E7, 150);
  tocarNota(NOTE_E7, 150);
  tocarNota(NOTE_E7, 150);
  tocarNota(NOTE_C7, 150);
  tocarNota(NOTE_G7, 300);
}

//////////////////////////////////////////////////
// PIR + ESTADOS
//////////////////////////////////////////////////
const int pirPin = 33;

enum Estados {
  ESTADO_IDLE,
  ESTADO_ALERTA_PRESENCA,
  ESTADO_ESPERA_TIMER,
  ESTADO_AGUARDANDO_SAIDA
};

Estados estadoAtual = ESTADO_IDLE;
unsigned long cronometroEstado = 0;
bool alarmeAtivado = false;

const unsigned long TEMPO_MAX_ALERTA = 10000;
const unsigned long TEMPO_TIMER_REMEDIO = 10000;
int compartimentoAberto = 0;

//////////////////////////////////////////////////
// MQTT TÓPICOS & TIME
//////////////////////////////////////////////////
String macStr;
char topicoComando[60];
char topicoEvento[60];

const char* ntpServer = "a.st1.ntp.br";
const long gmtOffset_sec = -3 * 3600;
const int daylightOffset_sec = 0;

String getTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "2026-01-01T00:00:00Z";
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

void publicarEvento(const char* tipo, int comp, const char* status) {
  StaticJsonDocument<256> doc;
  doc["evento"] = tipo;
  doc["compartimento"] = comp;
  doc["timestamp"] = getTimestamp();
  doc["status"] = status;

  char buffer[256];
  serializeJson(doc, buffer);
  client.publish(topicoEvento, buffer);
}

void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) msg += (char)payload[i];

  StaticJsonDocument<256> doc;
  if (deserializeJson(doc, msg)) return;

  const char* acao = doc["acao"];
  int comp = doc["compartimento"];

  if (acao && String(acao) == "ABRIR" && estadoAtual == ESTADO_IDLE) {
    prepararMovimento(comp);
    alarmeAtivado = false;
    compartimentoAberto = comp;
    cronometroEstado = millis();
    estadoAtual = ESTADO_ALERTA_PRESENCA;
  }
}

unsigned long ultimaTentativaMQTT = 0;
void gerenciarConexaoMQTT() {
  if (!client.connected()) {
    if (millis() - ultimaTentativaMQTT > 5000) { // Tenta a cada 5s
      ultimaTentativaMQTT = millis();
      String id = "ESP32-" + macStr;
      if (client.connect(id.c_str(), mqtt_user, mqtt_pass)) {
        client.subscribe(topicoComando);
      }
    }
  } else {
    client.loop();
  }
}

//////////////////////////////////////////////////
// SETUP
//////////////////////////////////////////////////
void setup() {
  Serial.begin(115200);

  pinMode(pirPin, INPUT);
  
  // 🔥 CORREÇÃO: Removidos os pinMode incorretos (17, 18, 5) que causavam conflito

  motor.setSpeed(15);
  ledcAttach(buzzerPin, 5000, 8); // Nova API (Core 3.0+)

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  macStr = WiFi.macAddress();
  macStr.replace(":", "");
  snprintf(topicoComando, 60, "dispositivo/%s/comando", macStr.c_str());
  snprintf(topicoEvento, 60, "dispositivo/%s/evento", macStr.c_str());

  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

//////////////////////////////////////////////////
// LOOP
//////////////////////////////////////////////////
void loop() {
  gerenciarConexaoMQTT(); // Não trava mais o código se a internet cair
  gerenciarMotorAsincrono();

  int pir = digitalRead(pirPin);

  switch (estadoAtual) {
    case ESTADO_ALERTA_PRESENCA:
      if (passosRestantes == 0 && !alarmeAtivado) {
        ledcWriteTone(buzzerPin, NOTE_G6);
        alarmeAtivado = true;
      }

      if (pir == HIGH) {
        ledcWriteTone(buzzerPin, 0); // Desliga buzzer
        publicarEvento("ABERTURA", compartimentoAberto, "SUCESSO");
        cronometroEstado = millis();
        estadoAtual = ESTADO_ESPERA_TIMER;
      }
      else if (millis() - cronometroEstado >= TEMPO_MAX_ALERTA) {
        ledcWriteTone(buzzerPin, 0); // Desliga buzzer
        voltarInicio();
        publicarEvento("FECHAMENTO", compartimentoAberto, "FALHA");
        estadoAtual = ESTADO_IDLE;
      }
      break;

    case ESTADO_ESPERA_TIMER:
      if (millis() - cronometroEstado >= TEMPO_TIMER_REMEDIO) {
        estadoAtual = ESTADO_AGUARDANDO_SAIDA;
      }
      break;

    case ESTADO_AGUARDANDO_SAIDA:
      // Garante que o motor parou antes de tentar voltar
      if (passosRestantes == 0) {
        if (compartimentoAtual != 0) {
          voltarInicio();
        } else {
          publicarEvento("FECHAMENTO", compartimentoAberto, "SUCESSO");
          retornoSolicitado = false;
          estadoAtual = ESTADO_IDLE;
        }
      }
      break;

    case ESTADO_IDLE:
    default:
      break;
  }
}