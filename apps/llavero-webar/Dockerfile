FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
# MindAR's offline compiler depends on native canvas, but the browser runtime
# and the Vite build do not require its install script.
RUN npm ci --ignore-scripts

COPY . ./
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
