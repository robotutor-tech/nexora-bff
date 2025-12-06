FROM node:22.14-alpine
WORKDIR /app
COPY package* ./
COPY node_modules ./node_modules
COPY dist/apps/bff ./dist/bff
EXPOSE 3001
CMD [ "node", "dist/bff/main" ]