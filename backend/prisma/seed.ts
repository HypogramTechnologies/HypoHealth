import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, DiaSemana } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DISPOSITIVO_ID = "bf909bc1-4110-454d-9ef5-eb9eb49db4e7";

const COMPARTIMENTOS = [
  { id: "a1b2c3d4-0001-4000-8000-000000000001", posicao: 1, dia_semana: DiaSemana.DOMINGO, descricao: "Compartimento 1 - Domingo" },
  { id: "a1b2c3d4-0002-4000-8000-000000000002", posicao: 2, dia_semana: DiaSemana.SEGUNDA, descricao: "Compartimento 2 - Segunda" },
  { id: "a1b2c3d4-0003-4000-8000-000000000003", posicao: 3, dia_semana: DiaSemana.TERCA, descricao: "Compartimento 3 - Terça" },
  { id: "a1b2c3d4-0004-4000-8000-000000000004", posicao: 4, dia_semana: DiaSemana.QUARTA, descricao: "Compartimento 4 - Quarta" },
  { id: "a1b2c3d4-0005-4000-8000-000000000005", posicao: 5, dia_semana: DiaSemana.QUINTA, descricao: "Compartimento 5 - Quinta" },
  { id: "a1b2c3d4-0006-4000-8000-000000000006", posicao: 6, dia_semana: DiaSemana.SEXTA, descricao: "Compartimento 6 - Sexta" },
  { id: "a1b2c3d4-0007-4000-8000-000000000007", posicao: 7, dia_semana: DiaSemana.SABADO, descricao: "Compartimento 7 - Sábado" },
];

async function main(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.dispositivo.upsert({
      where: { id: DISPOSITIVO_ID },
      update: {},
      create: {
        id: DISPOSITIVO_ID,
        nome: "Caixa de comprimidos",
        numero_serie: "0",
        criado_em: new Date(),
      },
    });

    await Promise.all(
      COMPARTIMENTOS.map((compartimento) =>
        tx.compartimento.upsert({
          where: { id: compartimento.id },
          update: {},
          create: {
            ...compartimento,
            dispositivo_id: DISPOSITIVO_ID,
          },
        })
      )
    );
  });
}

main()
  .then(() => {
    console.log("Seed concluído com sucesso.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  });