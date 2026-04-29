/*
  Warnings:

  - You are about to drop the column `tipo` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `dispositivos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dispositivo_id,dia_semana]` on the table `compartimentos` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dia_semana` on table `compartimentos` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TipoAcesso" AS ENUM ('PROPRIETARIO', 'RESPONSAVEL');

-- DropForeignKey
ALTER TABLE "dispositivos" DROP CONSTRAINT "dispositivos_usuario_id_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo";

-- AlterTable
ALTER TABLE "compartimentos" ALTER COLUMN "dia_semana" SET NOT NULL;

-- AlterTable
ALTER TABLE "dispositivos" DROP COLUMN "usuario_id";

-- DropEnum
DROP TYPE "TipoUsuario";

-- CreateTable
CREATE TABLE "usuarios_dispositivos" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "dispositivo_id" UUID NOT NULL,
    "tipo_acesso" "TipoAcesso" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_dispositivos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usuarios_dispositivos_usuario_id_idx" ON "usuarios_dispositivos"("usuario_id");

-- CreateIndex
CREATE INDEX "usuarios_dispositivos_dispositivo_id_idx" ON "usuarios_dispositivos"("dispositivo_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_dispositivos_usuario_id_dispositivo_id_key" ON "usuarios_dispositivos"("usuario_id", "dispositivo_id");

-- CreateIndex
CREATE UNIQUE INDEX "compartimentos_dispositivo_id_dia_semana_key" ON "compartimentos"("dispositivo_id", "dia_semana");

-- AddForeignKey
ALTER TABLE "usuarios_dispositivos" ADD CONSTRAINT "usuarios_dispositivos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_dispositivos" ADD CONSTRAINT "usuarios_dispositivos_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
