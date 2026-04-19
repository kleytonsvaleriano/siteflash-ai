FROM node:20-alpine

WORKDIR /app

# Instala dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci --only=production

# Copia código
COPY . .

# Cria diretórios necessários
RUN mkdir -p uploads

# Usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "src/server.js"]
