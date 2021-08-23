FROM node:alpine AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY tsconfig.json .env.production ./
COPY ./public ./public
COPY ./src ./src

RUN npm run build:local

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
