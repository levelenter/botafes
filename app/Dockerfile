FROM node:16-alpine3.15

WORKDIR /usr/src  /app

RUN yarn install -g http-server
COPY . .

RUN yarn install --prod --frozen-lockfile

EXPOSE 8080
CMD [ "http-server","./public" ]