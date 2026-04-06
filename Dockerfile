FROM node:16.13.2 AS builder

WORKDIR /app
COPY . /app

RUN npm install -g @quasar/cli
RUN npm install
RUN quasar build

FROM nginx:latest

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY ./docker-entrypoint.sh /app
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]


