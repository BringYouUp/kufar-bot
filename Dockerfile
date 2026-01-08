FROM node:20.19.0-alpine

WORKDIR /app

RUN apk add --no-cache git
RUN apk add --no-cache bash

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
