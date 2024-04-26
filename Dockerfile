FROM node:latest

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копируем остальной код приложения
COPY . .

CMD ["node", "./source/bot.js"]