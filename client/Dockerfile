# Stage 1: build (HAS npm)
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_ENV_MODE=production
ARG VITE_SOCKET_URL=
ENV VITE_ENV_MODE=$VITE_ENV_MODE
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# Stage 2: static asset server (internal only; the edge nginx proxies to this)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
