FROM node:14.17.3-alpine

WORKDIR /node-server

COPY package*.json .

RUN npm install
RUN npm install dotenv
RUN npm install -g nodemon

COPY . .
