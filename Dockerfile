FROM node:20.18.0-alpine

WORKDIR /server

COPY ./package.json ./

RUN npm install

COPY . .

ENV NODE_ENV=proction

EXPOSE 8080

CMD ["npm", "run", "server"]