FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx next build --webpack

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production SERVER_DATA_DIR=/data NEXT_TELEMETRY_DISABLED=1
COPY --chown=node:node --from=build /app /app
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME ["/data"]
EXPOSE 3000
CMD ["npm","run","start"]
