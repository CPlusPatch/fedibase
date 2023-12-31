FROM docker.io/node:19-alpine AS builder

RUN npm install --global pnpm

COPY . /app

RUN cd ./app && pnpm install
RUN cd ./app && pnpm build

FROM docker.io/node:19-alpine

COPY --from=builder /app/.output/ /app

CMD ["/app/server/index.mjs"]