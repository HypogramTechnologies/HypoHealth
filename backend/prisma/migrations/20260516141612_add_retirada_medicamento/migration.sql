/*
  Warnings:

  - Added the required column `atualizado_em` to the `retiradas_medicamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "retiradas_medicamentos" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dispositivo_evento_id" TEXT;
