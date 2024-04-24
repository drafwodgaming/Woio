FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app .
COPY package*.json ./
RUN npm ci
CMD [ "node", "./source/bot.js"]