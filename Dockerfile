# 開発環境用のDockerfile
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

COPY package*.json ./

RUN npm ci --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
