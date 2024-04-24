FROM node:latest as dev
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM node:latest
WORKDIR /opt/app
COPY --from=dev /opt/app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "./dist/bot.js"]
