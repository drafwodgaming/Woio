FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run dev

FROM node:latest
WORKDIR /app
COPY --from=builder /app .
COPY . .
CMD [ "node", "./source/bot.js"]