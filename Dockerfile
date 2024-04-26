FROM node:alpine as build
WORKDIR /app
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev

COPY package*.json ./
RUN npm ci
COPY . .

FROM node:alpine
WORKDIR /app
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev
COPY --from=build /app .
RUN npm ci --omit=dev
CMD [ "node", "./source/bot.js"]