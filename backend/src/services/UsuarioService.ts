import bcrypt from "bcrypt";
import {
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  UsuarioResponseDTO,
} from "../dtos/usuarioDTO";
import prisma from "../database/db";
import { salt } from "../utils/salt";

export class UsuarioService {
  async create(data: CreateUsuarioDTO): Promise<UsuarioResponseDTO> {
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (usuarioExiste) {
      throw new Error("Email já cadastrado");
    }

    const senhaHash = await bcrypt.hash(data.senha, salt);

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
      },
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      criado_em: usuario.criado_em,
    };
  }

  async update(
    id: string,
    data: UpdateUsuarioDTO,
  ): Promise<UsuarioResponseDTO> {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, salt);
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data,
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      criado_em: usuario.criado_em,
    };
  }

  async updatePushToken(
    id: string,
    token: string,
  ): Promise<UsuarioResponseDTO> {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { push_token: token },
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      criado_em: usuario.criado_em,
    };
  }

  async getByEmail(email: string): Promise<UsuarioResponseDTO | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { email },

      include: {
        dispositivos: {
          include: {
            dispositivo: true,
          },
        },
      },
    });

    if (!usuario) {
      return null;
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      criado_em: usuario.criado_em,

      dispositivos: usuario.dispositivos.map((d) => ({
        id: d.id,
        tipo: d.tipo_acesso,
        nome: d.dispositivo.nome,
        numero_serie: d.dispositivo.numero_serie,
      })),
    };
  }

  async getAll(): Promise<UsuarioResponseDTO[]> {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { criado_em: "desc" },
    });

    return usuarios.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      criado_em: u.criado_em,
    }));
  }

  async getByID(id: string): Promise<UsuarioResponseDTO | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        dispositivos: {
          include: {
            dispositivo: true,
          },
        },
      },
    });

    if (!usuario) return null;

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      criado_em: usuario.criado_em,
      dispositivos: usuario.dispositivos.map((d) => ({
        id: d.dispositivo.id,
        tipo: d.tipo_acesso,
        nome: d.dispositivo.nome,
        numero_serie: d.dispositivo.numero_serie,
      })),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.usuario.delete({
      where: { id },
    });
  }
}
