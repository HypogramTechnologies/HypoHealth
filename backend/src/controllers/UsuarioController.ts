import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { CreateUsuarioDTO, UpdateUsuarioDTO } from "../dtos/usuarioDTO";

const service = new UsuarioService();

export class UsuarioController {
  async create(req: Request, res: Response) {
    try {
      const data: CreateUsuarioDTO = req.body;

      const usuario = await service.create(data);

      return res.status(201).json(usuario);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const data: UpdateUsuarioDTO = req.body;

      const usuario = await service.update(id, data);

      return res.json(usuario);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  
  async getAll(req: Request, res: Response) {
    const usuarios = await service.getAll();
    return res.json(usuarios);
  }

  async getByID(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    const usuario = await service.getByID(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(usuario);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    await service.delete(id);

    return res.status(204).send();
  }
}

export const usuarioController = new UsuarioController();
