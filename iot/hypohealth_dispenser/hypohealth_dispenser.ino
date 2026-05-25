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
const int mqtt_port = 8883; // Porta para placas/IoT (MQTT sobre TLS)

WiFiClientSecure espClient;
PubSubClient client(espClient);
//////////////////////////////////////////////////
// MOTOR DE PASSO (Movimentação Não-Bloqueante)
//////////////////////////////////////////////////
const int stepsPerRevolution = 2048;
Stepper motor(stepsPerRevolution, 17, 18, 5, 19);

const int passosPorCompartimento = 256;
int compartimentoAtual = 0;
const int totalCompartimentos = 8; 

int passosRestantes = 0;
int direcaoMotor = 0; 

//////////////////////////////////////////////////
// BUZZER (MÚSICA E ALARME)
//////////////////////////////////////////////////
const int buzzerPin = 13;

#define NOTE_E7 2637
#define NOTE_C7 2093
#define NOTE_G7 3136
#define NOTE_G6 1568 

void tocarNota(int frequencia, int duracao) {
  ledcWriteTone(buzzerPin, frequencia);
  delay(duracao);
  ledcWriteTone(buzzerPin, 0);
  delay(50);
}

// Toca apenas a música do Mario (o alarme contínuo foi removido daqui)
void tocarMario() {
  tocarNota(NOTE_E7, 150);
  tocarNota(NOTE_E7, 150);
  delay(150);
  tocarNota(NOTE_E7, 150);
  delay(150);
  tocarNota(NOTE_C7, 150);
  tocarNota(NOTE_E7, 150);
  delay(150);
  tocarNota(NOTE_G7, 300);
  delay(300);
}

//////////////////////////////////////////////////
// SENSOR PIR E MÁQUINA DE ESTADOS (TIMERS)
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
bool alarmeAtivado = false; // Flag para garantir que o alarme ligue apenas uma vez

// const unsigned long TEMPO_MAX_ALERTA = 5 * 60 * 1000;    
// const unsigned long TEMPO_TIMER_REMEDIO = 3 * 60 * 1000; 
const unsigned long TEMPO_MAX_ALERTA = 10000;    
const unsigned long TEMPO_TIMER_REMEDIO = 10000; 

int compartimentoAberto = 0;

//////////////////////////////////////////////////
// VARIÁVEIS DE CONFIGURAÇÃO DINÂMICA
//////////////////////////////////////////////////
String macStr;
char topicoComando[60];
char topicoEvento[60];

const char* ntpServer = "a.st1.ntp.br";
const long  gmtOffset_sec = -3 * 3600; 
const int   daylightOffset_sec = 0;    

//////////////////////////////////////////////////
// TIMESTAMP ISO8601
//////////////////////////////////////////////////
String getTimestamp() {
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    return "2026-05-25T00:00:00Z"; 
  }
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

//////////////////////////////////////////////////
// PREPARAÇÃO DO MOTOR (CÁLCULO NÃO-BLOQUEANTE)
//////////////////////////////////////////////////
void prepararMovimento(int destino) {
  int diferenca = destino - compartimentoAtual;

  if (diferenca > totalCompartimentos / 2) {
    diferenca -= totalCompartimentos;
  } else if (diferenca < -totalCompartimentos / 2) {
    diferenca += totalCompartimentos;
  }

  int passos = diferenca * passosPorCompartimento;

  Serial.printf("Calculado movimento de %d para %d (%d passos)\n", compartimentoAtual, destino, passos);

  passosRestantes = abs(passos);
  direcaoMotor = (passos > 0) ? 1 : -1;
  
  compartimentoAtual = destino;
}

void gerenciarMotorAsincrono() {
  if (passosRestantes > 0) {
    motor.step(direcaoMotor);
    passosRestantes--;
  }
}

void voltarInicio() {
  Serial.println("Preparando retorno inteligente para a posição zero...");
  prepararMovimento(0);
}

//////////////////////////////////////////////////
// ENVIO DE EVENTOS MQTT
//////////////////////////////////////////////////
void publicarEvento(const char* tipoEvento, int compartimento, const char* status) {
  StaticJsonDocument<256> doc;

  doc["evento"] = tipoEvento;
  doc["compartimento"] = compartimento;
  doc["timestamp"] = getTimestamp();
  doc["status"] = status;

  char buffer[256];
  serializeJson(doc, buffer);

  client.publish(topicoEvento, buffer);
  Serial.printf("Evento enviado para o servidor (%s):\n%s\n", topicoEvento, buffer);
}

//////////////////////////////////////////////////
// PROCESSAMENTO DE COMANDOS (CALLBACK)
//////////////////////////////////////////////////
void callback(char* topic, byte* payload, unsigned int length) {
  String mensagem = "";
  for (int i = 0; i < length; i++) {
    mensagem += (char)payload[i];
  }

  Serial.printf("\nMensagem recebida no tópico [%s]: %s\n", topic, mensagem.c_str());

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, mensagem);
  if (error) {
    Serial.println("Erro ao decodificar JSON.");
    return;
  }

  const char* acao = doc["acao"]; 
  int compartimento = doc["compartimento"];

  if (acao != NULL && String(acao) == "ABRIR" && estadoAtual == ESTADO_IDLE) {
    if (compartimento < 0 || compartimento >= totalCompartimentos) {
      Serial.println("Erro: Compartimento inválido.");
      return;
    }


    // Configura o movimento (o motor vai girar em silêncio)
    prepararMovimento(compartimento);

    // Reseta controle do alarme e atualiza estados
    alarmeAtivado = false; 
    compartimentoAberto = compartimento;
    cronometroEstado = millis();
    estadoAtual = ESTADO_ALERTA_PRESENCA; 
  }
}

//////////////////////////////////////////////////
// RECONEXÃO MQTT
//////////////////////////////////////////////////
void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando MQTT...");
    String clientId = "ESP32_HypoHealth-" + macStr;

    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println(" conectado!");
      client.subscribe(topicoComando);
    } else {
      Serial.printf(" erro, rc=%d. Tentando em 2s...\n", client.state());
      delay(2000);
    }
  }
}

//////////////////////////////////////////////////
// WIFI SETUP
//////////////////////////////////////////////////
void setupWifi() {
  delay(10);
  Serial.print("\nConectando WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
}

//////////////////////////////////////////////////
// SETUP PRINCIPAL
//////////////////////////////////////////////////
void setup() {
  Serial.begin(115200);
  Serial.println("INICIANDO HYPOHEALTH");

  ledcAttach(buzzerPin, 5000, 8);
  pinMode(pirPin, INPUT);
  motor.setSpeed(15); 

  setupWifi();

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;
  int tentativas = 0;
  while(!getLocalTime(&timeinfo) && tentativas < 10){ 
     delay(500);
     tentativas++;
  }

  macStr = WiFi.macAddress();
  macStr.replace(":", ""); 
  
  snprintf(topicoComando, sizeof(topicoComando), "dispositivo/%s/comando", macStr.c_str());
  snprintf(topicoEvento, sizeof(topicoEvento), "dispositivo/%s/evento", macStr.c_str());

  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

//////////////////////////////////////////////////
// LOOP PRINCIPAL
//////////////////////////////////////////////////
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // O motor gira aqui passo a passo
  gerenciarMotorAsincrono();

  int presencaDetectada = digitalRead(pirPin);

  switch (estadoAtual) {
    
    case ESTADO_ALERTA_PRESENCA:
      //  Se o motor terminou de girar e o alarme ainda não ligou, ligará agora
      if (passosRestantes == 0 && !alarmeAtivado) {
        Serial.println("Motor chegou ao destino. Iniciando alarme contínuo!");
        ledcWriteTone(buzzerPin, NOTE_G6); 
        alarmeAtivado = true;
      }

      // Se detectar a pessoa
      if (presencaDetectada == HIGH) {
        Serial.println("[SUCESSO] Presença identificada! Cortando alarme.");
        
        ledcWriteTone(buzzerPin, 0); // Desliga o som imediatamente
        
        publicarEvento("ABERTURA", compartimentoAberto, "SUCESSO");
        
        cronometroEstado = millis(); 
        estadoAtual = ESTADO_ESPERA_TIMER;
      } 
      // Se estourar o tempo limite de 5 minutos
      else if (millis() - cronometroEstado >= TEMPO_MAX_ALERTA) {
        Serial.println("[TIMEOUT] Timeout de 5 minutos. Fechando gaveta por falha.");
        
        ledcWriteTone(buzzerPin, 0); 
        voltarInicio();              
        
        publicarEvento("FECHAMENTO", compartimentoAberto, "FALHA");
        
        estadoAtual = ESTADO_IDLE;
      }
      break;

    case ESTADO_ESPERA_TIMER:
      if (millis() - cronometroEstado >= TEMPO_TIMER_REMEDIO) {
        Serial.println("[TIMER CONCLUÍDO] Validando segurança...");
        estadoAtual = ESTADO_AGUARDANDO_SAIDA;
      }
      break;

    case ESTADO_AGUARDANDO_SAIDA:
      if (presencaDetectada == HIGH) {
        Serial.println("[ALERTA SEGURANÇA] Objeto detectado! Travando motor.");
        passosRestantes = 0; 
        delay(400); 
      } else {
        if (passosRestantes == 0 && compartimentoAtual != 0) {
           voltarInicio();
        }
        
        if (passosRestantes == 0 && compartimentoAtual == 0) {
          Serial.println("[ÁREA LIMPA] Gaveta fechada com sucesso.");
          publicarEvento("FECHAMENTO", compartimentoAberto, "SUCESSO");
          estadoAtual = ESTADO_IDLE;
        }
      }
      break;

    case ESTADO_IDLE:
    default:
      break;
  }
}