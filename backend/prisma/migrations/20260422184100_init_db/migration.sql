-- CreateEnum
CREATE TYPE "TipoAgendamento" AS ENUM ('HORARIO_FIXO', 'INTERVALO', 'DIAS_ESPECIFICOS');

-- CreateTable
CREATE TABLE "dispositivos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100),
    "numero_serie" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispositivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compartimentos" (
    "id" UUID NOT NULL,
    "dispositivo_id" UUID NOT NULL,
    "posicao" INTEGER NOT NULL,
    "descricao" VARCHAR(100),

    CONSTRAINT "compartimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamentos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "dosagem" VARCHAR(50) NOT NULL,
    "compartimento_id" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" UUID NOT NULL,
    "medicamento_id" UUID NOT NULL,
    "tipo" "TipoAgendamento" NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "intervalo_horas" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento_horarios" (
    "id" UUID NOT NULL,
    "agendamento_id" UUID NOT NULL,
    "horario" TIME NOT NULL,

    CONSTRAINT "agendamento_horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento_dias" (
    "id" UUID NOT NULL,
    "agendamento_id" UUID NOT NULL,
    "dia_semana" INTEGER NOT NULL,

    CONSTRAINT "agendamento_dias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dispositivos_numero_serie_key" ON "dispositivos"("numero_serie");

-- CreateIndex
CREATE INDEX "agendamentos_medicamento_id_idx" ON "agendamentos"("medicamento_id");

-- CreateIndex
CREATE INDEX "agendamento_horarios_agendamento_id_idx" ON "agendamento_horarios"("agendamento_id");

-- CreateIndex
CREATE INDEX "agendamento_dias_agendamento_id_idx" ON "agendamento_dias"("agendamento_id");

-- AddForeignKey
ALTER TABLE "compartimentos" ADD CONSTRAINT "compartimentos_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamentos" ADD CONSTRAINT "medicamentos_compartimento_id_fkey" FOREIGN KEY ("compartimento_id") REFERENCES "compartimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_horarios" ADD CONSTRAINT "agendamento_horarios_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_dias" ADD CONSTRAINT "agendamento_dias_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
