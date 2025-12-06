FROM node:22.14-alpine
WORKDIR /app
COPY package* ./
COPY node_modules ./node_modules
COPY dist/apps/mqtt-handler ./dist/mqtt-handler
EXPOSE 3002
CMD [ "node", "dist/mqtt-handler/main" ]