FROM node:alpine

WORKDIR /app

# Установка необходимых пакетов для сборки
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копируем остальной код приложения
COPY . .

CMD ["node", "./source/bot.js"]