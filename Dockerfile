FROM node:18-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:18-alpine AS prod
COPY --from=dev /app/package*.json ./
RUN npm ci --only=production
COPY --from=dev /app .
CMD [ "node", "./source/bot.js"]