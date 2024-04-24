FROM node:latest
WORKDIR /app
ADD *.json .
RUN npm ci
ADD . .
COPY . .
CMD [ "node", "./source/bot.js"]