/*
  Warnings:

  - The values [DIAS_ESPECIFICOS] on the enum `TipoAgendamento` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `compartimento_id` on the `medicamentos` table. All the data in the column will be lost.
  - You are about to drop the `agendamento_dias` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `compartimento_id` to the `agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `medicamentos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('IDOSO', 'RESPONSAVEL');

-- AlterEnum
BEGIN;
CREATE TYPE "TipoAgendamento_new" AS ENUM ('HORARIO_FIXO', 'INTERVALO');
ALTER TABLE "agendamentos" ALTER COLUMN "tipo" TYPE "TipoAgendamento_new" USING ("tipo"::text::"TipoAgendamento_new");
ALTER TYPE "TipoAgendamento" RENAME TO "TipoAgendamento_old";
ALTER TYPE "TipoAgendamento_new" RENAME TO "TipoAgendamento";
DROP TYPE "public"."TipoAgendamento_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "agendamento_dias" DROP CONSTRAINT "agendamento_dias_agendamento_id_fkey";

-- DropForeignKey
ALTER TABLE "medicamentos" DROP CONSTRAINT "medicamentos_compartimento_id_fkey";

-- AlterTable
ALTER TABLE "agendamentos" ADD COLUMN     "compartimento_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "compartimentos" ADD COLUMN     "dia_semana" "DiaSemana";

-- AlterTable
ALTER TABLE "dispositivos" ADD COLUMN     "usuario_id" UUID;

-- AlterTable
ALTER TABLE "medicamentos" DROP COLUMN "compartimento_id",
ADD COLUMN     "descricao" VARCHAR(150) NOT NULL;

-- DropTable
DROP TABLE "agendamento_dias";

-- CreateTable
CREATE TABLE "medicamentos_compartimentos" (
    "id" UUID NOT NULL,
    "medicamento_id" UUID NOT NULL,
    "compartimento_id" UUID NOT NULL,

    CONSTRAINT "medicamentos_compartimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicamentos_compartimentos_medicamento_id_idx" ON "medicamentos_compartimentos"("medicamento_id");

-- CreateIndex
CREATE INDEX "medicamentos_compartimentos_compartimento_id_idx" ON "medicamentos_compartimentos"("compartimento_id");

-- CreateIndex
CREATE UNIQUE INDEX "medicamentos_compartimentos_medicamento_id_compartimento_id_key" ON "medicamentos_compartimentos"("medicamento_id", "compartimento_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "agendamentos_compartimento_id_idx" ON "agendamentos"("compartimento_id");

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamentos_compartimentos" ADD CONSTRAINT "medicamentos_compartimentos_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamentos_compartimentos" ADD CONSTRAINT "medicamentos_compartimentos_compartimento_id_fkey" FOREIGN KEY ("compartimento_id") REFERENCES "compartimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_compartimento_id_fkey" FOREIGN KEY ("compartimento_id") REFERENCES "compartimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
