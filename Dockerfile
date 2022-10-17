FROM node:16

# アプリケーションディレクトリを作成する
WORKDIR /app

RUN npm install -g pm2
# キャッシュを利用するために、package.jsonとpackage-lock.jsonのみをコピーし、
# 依存関係を先にインストール
COPY ./package.json .
RUN npm install

RUN npx prisma generate
# アプリケーションコードをコンテナにコピー
COPY . .

EXPOSE 3004

RUN npm config set user 0
RUN npm config set unsafe-perm true
#CMD [ "npm", "run","prod" ]
CMD [ "npm", "run", "dev:sv" ]
