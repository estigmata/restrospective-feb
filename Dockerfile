FROM node:8.2.1

RUN mkdir -p /app/project

WORKDIR /app/project

COPY . /app/project

RUN npm run build:prod

RUN npm --proxy http://172.31.90.162:8080 install

EXPOSE 4200

ENTRYPOINT ["node", "server.js"]