
---

# 💊 HypoHealth

**HypoHealth** é um sistema inteligente de gerenciamento e dispensação de medicamentos que integra **Internet das Coisas (IoT)** e uma **aplicação móvel**. A solução foi projetada para auxiliar no controle rigoroso de tratamentos, garantindo que o medicamento correto seja acessado apenas no horário programado, prevenindo erros de dosagem e esquecimentos.

O foco principal do projeto é promover a **autonomia de pacientes**, especialmente idosos com doenças crônicas, e oferecer **segurança e tranquilidade aos familiares e cuidadores** por meio do monitoramento remoto em tempo real.

---

## 📌 Problema

O envelhecimento populacional trouxe um aumento no uso simultâneo de múltiplos fármacos (polifarmácia). A complexidade de gerenciar diferentes horários e dosagens torna o processo suscetível a falhas, o que pode comprometer a eficácia do tratamento e levar a emergências médicas.

Atualmente, muitos pacientes dependem de cuidadores que nem sempre podem estar presentes 24 horas por dia, criando uma lacuna na supervisão da administração dos medicamentos.

---

## 💡 Solução

O **HypoHealth** resolve esses desafios através de um ecossistema integrado:
* **Dispositivo IoT:** Uma caixa organizadora com múltiplos compartimentos que permanecem bloqueados, liberando apenas o medicamento do horário atual e emitindo alertas sonoros.
* **Monitoramento Ativo:** O sistema detecta se o compartimento foi aberto. Caso a retirada não ocorra no intervalo configurado, o responsável recebe uma notificação imediata.
* **Gestão Centralizada:** Um aplicativo móvel permite que o cuidador cadastre dosagens, horários e acompanhe o histórico de adesão do paciente à distância.

---

## ✅ Requisitos

### Requisitos Funcionais
* **RF01/02**: Cadastro completo de medicamentos (nome, dose, frequência) e programação de horários.
* **RF03/04**: Controle físico de compartimentos com bloqueio de segurança contra acesso indevido.
* **RF05/08**: Alerta sonoro no dispositivo e notificações push para o responsável em caso de atraso.
* **RF11**: Sincronização em tempo real entre o dispositivo, a nuvem e o aplicativo.

### Requisitos Não Funcionais
* **RNF01/05**: Arquitetura modular com Backend em **Node.js + TypeScript** e API REST.
* **RNF02/03**: Comunicação segura (HTTPS/MQTT) e funcionamento offline com armazenamento local para casos de perda de conexão.
* **RNF04**: Interface simplificada e acessível, otimizada para o público idoso.
* **RNF08/09**: Pipeline de **CI/CD** automatizado para build, testes e deploy.

---

## 👥 User Stories

* **RF01**: Como cuidador, quero cadastrar os remédios do meu familiar para que o sistema organize os horários automaticamente.
* **RF03**: Como paciente idoso, quero que apenas o compartimento correto se abra no horário do remédio para que eu não tome a medicação errada.
* **RF08**: Como filho(a), quero receber um aviso no celular se meu pai não tomar o remédio após 15 minutos do alerta, para que eu possa ligar e verificar.
* **RF09**: Como médico/cuidador, quero visualizar o histórico de administrações para verificar se o paciente está seguindo o tratamento corretamente.

---

## 🛠️ Tecnologias Utilizadas
* **Hardware:** ESP32 (sensores de abertura, servo motores, buzzer).
* **Backend:** Node.js, Express, TypeScript.
* **Comunicação:** MQTT / HTTPS e API REST.
* **Infraestrutura:** Docker (Conteinerização) e Banco de Dados em nuvem.
* **DevOps:** Git (Git Flow) e Pipeline de CI/CD (GitHub Actions).

---

## 🚀 Como Executar o Projeto

```bash
# Clone este repositório
git clone https://github.com/seu-repo/HypoHealth.git

# Acesse a pasta do backend
cd HypoHealth/backend

# Instale as dependências
npm install

# Inicie o ambiente com Docker
docker-compose up -d
```

---

## 📅 Gestão do Projeto

- **Trello:** [link do board](https://trello.com/invite/b/69e114a9c9cea966df5f0b5a/ATTIeaedeebff4e4078a0d88a7002b020b8404680E57/hypohealth)  

---

### 🌀 Sprint 1

#### 📋 Tarefas  

| ID  | Nome                                                                                          | Responsáveis                                  | Tarefa Finalizada | Link                                                                 | Requisitos atendidos |
|-----|-----------------------------------------------------------------------------------------------|-----------------------------------------------|-------------------|----------------------------------------------------------------------|----------------------|




#### 📉 Burndown  

[Burndown Sprint 1]()  

---

### 🌀 Sprint 2

#### 📋 Tarefas  

| ID         | Nome                                                                                         | Responsáveis                                      | Tarefa Finalizada | Link                                                               | Requisitos atendidos |
|-------------|----------------------------------------------------------------------------------------------|---------------------------------------------------|-------------------|--------------------------------------------------------------------|----------------------|



#### 📉 Burndown  

[Burndown Sprint 2]()  

---

### 🌀 Sprint 3

#### 📋 Tarefas  

| ID             | Nome                                                                             | Responsáveis                          | Tarefa Finalizada | Link                                                           | Requisitos atendidos |
| -------------- | -------------------------------------------------------------------------------- | ------------------------------------- | ----------------- | -------------------------------------------------------------- | -------------------- |




#### 📉 Burndown  

[Burndown Sprint 3]()  


---

## 👨🏻‍💻 Equipe

| Nome | Função |
| :--- | :--- |
| **Adson Ottoni Balbino Filho** | Developer |
| **Andressa Stephane Toledo da Silva** | Developer |
| **Carlos Eduardo da Silva Magalhães** | Developer |
| **Eduardo Henrique Alves Arantes** | Scrum Master / Developer |
| **João Pedro Souza dos Anjos** | Product Owner / Developer |

---

## 📄 Licença
Este projeto é de uso acadêmico e está sob a licença [MIT](LICENSE).