FROM node:21-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:21-alpine 
WORKDIR /app
COPY --from=build /app .
COPY package*.json ./
RUN npm ci --omit=dev
CMD [ "node", "./source/bot.js"]