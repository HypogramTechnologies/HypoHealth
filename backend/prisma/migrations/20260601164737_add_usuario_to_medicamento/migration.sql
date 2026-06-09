/*
  Warnings:

  - Added the required column `usuario_id` to the `medicamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicamentos" ADD COLUMN     "usuario_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "medicamentos_usuario_id_idx" ON "medicamentos"("usuario_id");

-- AddForeignKey
ALTER TABLE "medicamentos" ADD CONSTRAINT "medicamentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
