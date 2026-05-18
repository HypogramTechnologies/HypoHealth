import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/db";
import { UsuarioService } from "./UsuarioService";
import { LoginDTO } from "../dtos/authDTO";
import { CreateUsuarioDTO } from "../dtos/usuarioDTO";
import { EXPIRES_IN } from "../utils/jwt";

const usuarioService = new UsuarioService();

export class AuthService {
  
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

    return {
      usuario,
      token,
    };
  }

  async login(data: LoginDTO) {
    // const usuario = await prisma.usuario.findUnique({
    //   where: {
    //     email: data.email,
    //   },
    // });

    const usuario = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },

    include: {
      dispositivos: {
        include: {
          dispositivo: true,
        },
      },
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

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,

        dispositivos:
          usuario.dispositivos.map(
            (item) => ({
              id: item.dispositivo.id,

              tipo_acesso:
                item.tipo_acesso,
            }),
          ),
      },

      token,
    };
  }
}
