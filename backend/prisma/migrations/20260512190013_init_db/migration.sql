-- CreateEnum
CREATE TYPE "StatusRetirada" AS ENUM ('PENDENTE', 'RETIRADO', 'ATRASADO', 'NAO_RETIRADO');

-- CreateTable
CREATE TABLE "retiradas_medicamentos" (
    "id" UUID NOT NULL,
    "agendamento_horario_id" UUID NOT NULL,
    "horario_programado" TIMESTAMP(6) NOT NULL,
    "horario_retirada" TIMESTAMP(6),
    "status" "StatusRetirada" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retiradas_medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "retiradas_medicamentos_agendamento_horario_id_idx" ON "retiradas_medicamentos"("agendamento_horario_id");

-- AddForeignKey
ALTER TABLE "retiradas_medicamentos" ADD CONSTRAINT "retiradas_medicamentos_agendamento_horario_id_fkey" FOREIGN KEY ("agendamento_horario_id") REFERENCES "agendamento_horarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
