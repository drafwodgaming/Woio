FROM node:latest

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev
    
# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копируем остальной код приложения
COPY . .

CMD ["node", "./source/bot.js"]