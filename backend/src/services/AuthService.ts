import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../database/db";

import { UsuarioService } from "./UsuarioService";

import { LoginDTO } from "../dtos/authDTO";
import { CreateUsuarioDTO } from "../dtos/usuarioDTO";

import { EXPIRES_IN } from "../utils/jwt";
import { UsuarioDispositivoService } from "./UsuarioDispositivoService";

const usuarioService = new UsuarioService();
const usuarioDispositivoService = new UsuarioDispositivoService();

export class AuthService {
  private async montarUsuario(usuarioId: string) {
    // Usuário + dispositivos
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },

      include: {
        dispositivos: {
          include: {
            dispositivo: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    console.log("usuario recuperado:", usuario);
    // Primeiro dispositivo do usuário
    const primeiroDispositivoId = usuario.dispositivos[0]?.dispositivo_id;

    let usuarioProprietarioId: string | null = null;

    let usuarioProprietarioNome: string | null = null;

    // Busca o proprietário do dispositivo
    if (primeiroDispositivoId) {
      const vinculoProprietario = await prisma.usuarioDispositivo.findFirst({
        where: {
          dispositivo_id: primeiroDispositivoId,

          tipo_acesso: "PROPRIETARIO",
        },

        include: {
          usuario: true,
        },
      });

      if (vinculoProprietario) {
        usuarioProprietarioId = vinculoProprietario.usuario_id;

        usuarioProprietarioNome = vinculoProprietario.usuario?.nome || null;
      }
    }

    return {
      id: usuario.id,

      nome: usuario.nome,

      email: usuario.email,

      usuario_proprietario_id: usuarioProprietarioId,

      usuario_proprietario_nome: usuarioProprietarioNome,

      dispositivos: usuario.dispositivos.map((item) => ({
        id: item.dispositivo_id,

        tipo_acesso: item.tipo_acesso,

        nome: item.dispositivo.nome,

        numero_serie: item.dispositivo.numero_serie,
      })),
    };
  }

  async cadastrar(data: CreateUsuarioDTO) {
    const usuario = await usuarioService.create(data);

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: EXPIRES_IN,
      },
    );

    await usuarioDispositivoService.create({
      usuario_id: usuario.id,
      dispositivo_id: data.dispositivo_id as string,
      tipo_acesso: "PROPRIETARIO",
    });

    const usuarioCompleto = await this.montarUsuario(usuario.id);

    return {
      usuario: usuarioCompleto,
      token,
    };
  }

  async login(data: LoginDTO) {
    const usuario = await prisma.usuario.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: EXPIRES_IN,
      },
    );

    const usuarioCompleto = await this.montarUsuario(usuario.id);

    return {
      usuario: usuarioCompleto,
      token,
    };
  }
}
