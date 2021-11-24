FROM node:16-alpine

WORKDIR /usr/app

COPY ../ .

WORKDIR /usr/app/api

RUN npm install --quiet

CMD npm run start