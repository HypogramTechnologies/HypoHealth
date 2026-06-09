import { Request, Response } from "express";

import { DispositivoService } from "../services/DispositivoService";

const dispositivoService = new DispositivoService();

export class DispositivoController {
  async create(req: Request, res: Response) {
    try {
      console.log(`[DispositivoController] POST /dispositivos`);

      const { nome, mac_address } = req.body;

      if (!nome || !mac_address) {
        return res.status(400).json({
          erro: "Nome e mac_address são obrigatórios.",
        });
      }

      const dispositivo = await dispositivoService.create({
        nome,
        numero_serie: mac_address,
      });

      return res.status(201).json(dispositivo);
    } catch (error: any) {
      console.error(
        `[DispositivoController] Erro ao criar dispositivo:`,
        error,
      );

      if (error.message === "MAC_ADDRESS_EXISTE") {
        return res.status(409).json({
          erro: "Já existe um dispositivo com este MAC Address.",
        });
      }

      return res.status(500).json({
        erro: "Erro ao criar dispositivo.",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      console.log(`[DispositivoController] GET /dispositivos`);

      const dispositivos = await dispositivoService.getAll();

      return res.status(200).json(dispositivos);
    } catch (error) {
      console.error(
        `[DispositivoController] Erro ao buscar dispositivos:`,
        error,
      );

      return res.status(500).json({
        erro: "Erro ao buscar dispositivos.",
      });
    }
  }

  async verificarMac(req: Request, res: Response) {
    try {
      const { numero_serie } = req.query as {
        numero_serie: string;
      };

      if (!numero_serie) {
        return res.status(400).json({
          erro: "Número de série não informado.",
        });
      }

      const resultado = await dispositivoService.validarMac(numero_serie);

      return res.status(200).json(resultado);
    } catch (error) {
      console.error("[DispositivoController] ❌ Erro ao verificar MAC:", error);

      return res.status(500).json({
        erro: "Erro ao verificar número de série.",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      console.log(`[DispositivoController] PUT /dispositivos/${id}`);

      const { nome, mac_address } = req.body;

      const dispositivo = await dispositivoService.update(String(id), {
        nome,
        numero_serie: mac_address,
      });

      return res.status(200).json(dispositivo);
    } catch (error) {
      console.error(
        `[DispositivoController] Erro ao atualizar dispositivo:`,
        error,
      );

      return res.status(500).json({
        erro: "Erro ao atualizar dispositivo.",
      });
    }
  }
}

export const dispositivoController = new DispositivoController();
