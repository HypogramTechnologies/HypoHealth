import express from 'express';
import cors from 'cors';
import prisma from './database/db';
import routes from './routes/index'; 

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de Healthcheck (Útil para o Docker verificar se o app está vivo)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da Aplicação
app.use('/api', routes); // Centraliza as rotas em /api
// Inicialização do Servidor
const start = async () => {
  try {
    // Tenta conectar ao banco antes de subir o servidor
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

    app.listen(PORT, () => {
      console.log(` HypoHealth Server rodando na porta ${PORT}`);
      console.log(` Local: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

start();