import prisma from "../database/db";

const COMPARTIMENTOS_PADRAO = [
  {
    posicao: 1,
    dia_semana: "DOMINGO",
    descricao: "Compartimento 1 - Domingo",
  },
  {
    posicao: 2,
    dia_semana: "SEGUNDA",
    descricao: "Compartimento 2 - Segunda",
  },
  {
    posicao: 3,
    dia_semana: "TERCA",
    descricao: "Compartimento 3 - Terça",
  },
  {
    posicao: 4,
    dia_semana: "QUARTA",
    descricao: "Compartimento 4 - Quarta",
  },
  {
    posicao: 5,
    dia_semana: "QUINTA",
    descricao: "Compartimento 5 - Quinta",
  },
  {
    posicao: 6,
    dia_semana: "SEXTA",
    descricao: "Compartimento 6 - Sexta",
  },
  {
    posicao: 7,
    dia_semana: "SABADO",
    descricao: "Compartimento 7 - Sábado",
  },
];

export class DispositivoService {
  async create(data: { nome: string; numero_serie: string }) {
    try {
      console.log(`[DispositivoService] Criando dispositivo: ${data.nome}`);

      console.log("data no create", data);
      const numeroSerie = data.numero_serie.trim().toUpperCase();

      const existente = await prisma.dispositivo.findFirst({
        where: {
          numero_serie: numeroSerie,
        },
      });

      if (existente) {
        throw new Error("Este número de série já está cadastrado.");
      }

      const dispositivo = await prisma.$transaction(async (tx) => {
        const novoDispositivo = await tx.dispositivo.create({
          data: {
            nome: data.nome,
            numero_serie: numeroSerie,
          },
        });

        await tx.compartimento.createMany({
          data: COMPARTIMENTOS_PADRAO.map((compartimento) => ({
            posicao: compartimento.posicao,

            dia_semana: compartimento.dia_semana as any,

            descricao: compartimento.descricao,

            dispositivo_id: novoDispositivo.id,
          })),
        });

        return novoDispositivo;
      });

      console.log(`[DispositivoService] Dispositivo criado: ${dispositivo.id}`);

      return dispositivo;
    } catch (error) {
      console.error(`[DispositivoService] Erro ao criar dispositivo:`, error);

      throw error;
    }
  }

  async getAll() {
    try {
      console.log(`[DispositivoService] Buscando dispositivos`);

      const dispositivos = await prisma.dispositivo.findMany({
        orderBy: {
          criado_em: "desc",
        },

        select: {
          id: true,
          nome: true,
          numero_serie: true,
          criado_em: true,
        },
      });

      return dispositivos;
    } catch (error) {
      console.error(`[DispositivoService] Erro ao buscar dispositivos:`, error);

      throw error;
    }
  }

  async update(
    id: string,
    data: {
      nome?: string;
      numero_serie?: string;
    },
  ) {
    try {
      console.log(`[DispositivoService] Atualizando dispositivo: ${id}`);

      if (data.numero_serie) {
        const numeroSerie = data.numero_serie.trim().toUpperCase();

        const existente = await prisma.dispositivo.findFirst({
          where: {
            numero_serie: numeroSerie,

            NOT: {
              id,
            },
          },
        });

        if (existente) {
          throw new Error("Este número de série já está cadastrado.");
        }

        data.numero_serie = numeroSerie;
      }

      const dispositivo = await prisma.dispositivo.update({
        where: {
          id,
        },

        data,

        select: {
          id: true,
          nome: true,
          numero_serie: true,
          criado_em: true,
        },
      });

      console.log(
        `[DispositivoService] Dispositivo atualizado: ${dispositivo.id}`,
      );

      return dispositivo;
    } catch (error) {
      console.error(
        `[DispositivoService] Erro ao atualizar dispositivo:`,
        error,
      );

      throw error;
    }
  }

  async validarMac(numero_serie: string) {
    try {
      console.log(
        `[DispositivoService] Verificando número de série: ${numero_serie}`,
      );
      const numeroSerie = numero_serie.trim().toUpperCase();

      const dispositivo = await prisma.dispositivo.findFirst({
        where: {
          numero_serie: numeroSerie,
        },

        select: {
          id: true,
        },
      });

      return {
        existe: !!dispositivo,
      };
    } catch (error) {
      console.error(
        `[DispositivoService] Erro ao verificar número de série:`,
        error,
      );

      throw error;
    }
  }
}
