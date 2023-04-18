FROM node:18-alpine as base

FROM base as builder

WORKDIR /opt/adsrider

COPY ./package*.json .
RUN npm ci
COPY ./tsconfig.json .
COPY ./src ./src
RUN npm run build

############################################
FROM base

WORKDIR /opt/adsrider
RUN apk add --no-cache tini

COPY --from=builder /opt/adsrider/node_modules ./node_modules
COPY --from=builder /opt/adsrider/dist ./dist
COPY ./docker-entrypoint.sh /usr/bin

ENTRYPOINT ["/sbin/tini", "--", "/usr/bin/docker-entrypoint.sh"]

CMD []
