FROM node:20.18.0-alpine

WORKDIR /server

COPY ./package.json ./

RUN apk update && apk upgrade && \
    apk add --no-cache base git openshh

RUN npm install

COPY . .

ENV NODE_ENV=proction

EXPOSE 8080

CMD ["npm", "run", "server"]