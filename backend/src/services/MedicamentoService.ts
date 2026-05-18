import prisma from "../database/db";

export class MedicamentoService {
  async create(
    dados: { nome: string; dosagem: string; descricao?: string },
    tx?: any,
  ) {
    const db = tx || prisma;
    return await db.medicamento.create({
      data: dados,
    });
  }

  async getAll() {
    return await prisma.medicamento.findMany();
  }

  async getById(id: string) {
    return await prisma.medicamento.findUnique({ where: { id } });
  }

  async update(id: string, dados: any) {
    return await prisma.medicamento.update({
      where: { id },
      data: dados,
    });
  }

  async delete(id: string) {
    return await prisma.medicamento.delete({ where: { id } });
  }
}
