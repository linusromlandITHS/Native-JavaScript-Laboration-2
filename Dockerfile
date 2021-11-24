FROM node:16-alpine

WORKDIR /usr/app

COPY . .

WORKDIR /usr/app/api

RUN npm install --quiet

EXPOSE 3000

CMD npm run start