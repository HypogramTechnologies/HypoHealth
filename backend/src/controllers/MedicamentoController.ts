import { Request, Response } from "express";
import prisma from "../database/db";

export class MedicamentoController {
  async create(req: Request, res: Response) {
    try {
      const { nome, dosagem, compartimento } = req.body;

      if (!nome || !dosagem || !compartimento) {
        return res
          .status(400)
          .json({ erro: "Nome, dosagem e compartimento são obrigatórios." });
      }

      const novoMedicamento = await prisma.medicamento.create({
        data: { nome, dosagem, compartimento_id: compartimento },
      });
      return res.status(201).json(novoMedicamento);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao cadastrar medicamento." });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const medicamentos = await prisma.medicamento.findMany();
      return res.status(200).json(medicamentos);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar medicamentos." });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const medicamento = await prisma.medicamento.findUnique({
        where: { id: String(id) },
      });

      if (!medicamento) {
        return res.status(404).json({ erro: "Medicamento não encontrado." });
      }

      return res.status(200).json(medicamento);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar medicamento." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, dosagem, compartimento } = req.body;

      const medicamentoAtualizado = await prisma.medicamento.update({
        where: { id: String(id) },
        data: {
          nome,
          dosagem,
          compartimento_id: compartimento,
        },
      });

      return res.status(200).json(medicamentoAtualizado);
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao atualizar medicamento. Verifique se o ID existe.",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.medicamento.delete({
        where: { id: String(id) },
      });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao deletar medicamento." });
    }
  }
}

export const medicamentoController = new MedicamentoController();
