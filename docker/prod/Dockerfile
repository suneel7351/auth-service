From node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

From node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app


COPY package*.json ./

RUN npm ci --ignore-scripts


COPY --from=builder /app/build ./

EXPOSE 5500

CMD ["node","src/server.js"]