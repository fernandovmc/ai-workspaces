FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm install -g typescript
RUN tsc -p tsconfig.build.json

FROM node:22-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
RUN mkdir -p ./uploads
COPY --from=builder /app/uploads ./uploads

EXPOSE 5000

CMD ["node", "dist/main"]