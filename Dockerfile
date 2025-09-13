# 本番環境用のDockerfile
FROM node:22-slim

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    sane-utils \
    cups \
    cups-client \
    cups-bsd \
    printer-driver-gutenprint \
    socat \
    && rm -rf /var/lib/apt/lists/*

# CUPSの基本設定
RUN mkdir -p /etc/cups && \
    echo "ServerName localhost" > /etc/cups/client.conf

# 作業ディレクトリを設定
WORKDIR /app

COPY package*.json ./

RUN npm ci --frozen-lockfile

COPY . .

# アプリケーションをビルド
RUN npm run build

ENV PORT 3000
EXPOSE 3000

ENTRYPOINT ["/app/scripts/entrypoint.sh"]

CMD ["npm", "run", "start"]
