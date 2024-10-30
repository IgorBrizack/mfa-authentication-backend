# Usando a imagem base do Node.js
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
