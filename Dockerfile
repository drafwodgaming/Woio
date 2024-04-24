FROM node:latest as dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM node:latest
WORKDIR /app
COPY --from=dev /app/package*.json ./
RUN npm ci --omit=dev
CMD ["node", "./source/bot.js"]
