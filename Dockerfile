FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:latest
WORKDIR /app
COPY --from=build /app .
COPY package*.json ./
RUN npm ci
CMD [ "node", "./source/bot.js"]