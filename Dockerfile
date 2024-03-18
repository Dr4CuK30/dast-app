FROM node:20-bullseye as builder
ENV IS_WORKER false
WORKDIR /usr/src/dast-api

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
COPY --chown=node:node . .
RUN npm run build
RUN npm cache clean --force

USER node

FROM node:20-bullseye as production
ENV IS_WORKER false
COPY --chown=node:node --from=builder /usr/src/dast-api/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/dast-api/dist ./dist
USER node
CMD [ "node", "dist/main.js" ]