FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Instalar o NestJS CLI globalmente e depois as dependências
RUN npm install -g @nestjs/cli && npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
# Certifique-se de que o diretório uploads existe, mesmo que esteja vazio
RUN mkdir -p ./uploads
COPY --from=builder /app/uploads ./uploads

EXPOSE 5000

CMD ["npm", "run", "start:prod"]