# Estágio 1: Build
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Instala dependências (incluindo as de desenvolvimento para o build)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copia o código e gera o cliente Prisma + Build do TS
COPY . .
RUN npx prisma generate
RUN npm run build

# Estágio 2: Produção (Imagem final)
FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Expõe a porta da API
EXPOSE 3001

# Executa as migrações e inicia o servidor
CMD ["sh", "-c", "if [ -z \"$DATABASE_URL\" ] || [ \"$DATABASE_URL\" = \"\" ]; then export DATABASE_URL=\"postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public\"; fi; npx prisma migrate deploy && node dist/src/server.js"]