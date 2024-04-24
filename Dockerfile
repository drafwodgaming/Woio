FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:latest
WORKDIR /app
COPY --from=build /app .
COPY . .
CMD [ "node", "./source/bot.js"]