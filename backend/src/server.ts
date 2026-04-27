import express from "express";
import cors from "cors";
import prisma from "./database/db";
import routes from "./routes/index";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(` Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

start();
