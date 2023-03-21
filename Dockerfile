FROM node:18

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

COPY . .

RUN npm install &&\
    npm install --dev

RUN (cd ./frontend && npm install && npm install --include=dev)

EXPOSE 3000 80

CMD ["npm", "run", "start:dev"]
