# Start your image with a node base image
FROM node:latest

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

RUN npm install

COPY . .

# Start the app using serve command
CMD [ "node", "./source/bot.js"]