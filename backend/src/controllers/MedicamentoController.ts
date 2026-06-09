import { Request, Response } from "express";
import prisma from "../database/db";
import { logger } from "../utils/logger";

export class MedicamentoController {
  async create(req: Request, res: Response) {
    try {
      const { nome, dosagem, descricao, usuario_id } = req.body;

      if (!nome || !dosagem) {
        return res
          .status(400)
          .json({ erro: "Nome e dosagem são obrigatórios." });
      }

      const novoMedicamento = await prisma.medicamento.create({
        data: {
          nome,
          dosagem,
          descricao,
          usuario_id,
        },
      });
      return res.status(201).json(novoMedicamento);
    } catch (error) {
      logger.error(
        `[MedicamentoController] Erro ao cadastrar medicamento: ${String(error)}`,
      );
      return res.status(500).json({ erro: "Erro ao cadastrar medicamento." });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const medicamentos = await prisma.medicamento.findMany();
      return res.status(200).json(medicamentos);
    } catch (error) {
      logger.error(
        `[MedicamentoController] Erro ao buscar medicamentos: ${String(error)}`,
      );
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
      logger.error(
        `[MedicamentoController] Erro ao buscar medicamento por id: ${String(error)}`,
      );
      return res.status(500).json({ erro: "Erro ao buscar medicamento." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, dosagem, descricao } = req.body;

      const medicamentoAtualizado = await prisma.medicamento.update({
        where: { id: String(id) },
        data: {
          nome,
          dosagem,
          descricao,
        },
      });

      return res.status(200).json(medicamentoAtualizado);
    } catch (error) {
      logger.error(
        `[MedicamentoController] Erro ao atualizar medicamento: ${String(error)}`,
      );
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
      logger.error(
        `[MedicamentoController] Erro ao deletar medicamento: ${String(error)}`,
      );
      return res.status(500).json({ erro: "Erro ao deletar medicamento." });
    }
  }
}

export const medicamentoController = new MedicamentoController();
