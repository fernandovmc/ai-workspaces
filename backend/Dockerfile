FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; then \
      npm run build && \
      npm prune --production; \
    fi

EXPOSE 5000

CMD if [ "$NODE_ENV" = "production" ]; then \
      npm run start:prod; \
    else \
      npm run start:dev; \
    fi