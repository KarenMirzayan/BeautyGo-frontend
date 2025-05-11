# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=production

# Serve Stage
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/beauty-go/browser /usr/share/nginx/html

EXPOSE 80

#docker build -t beauty-go-front .
#docker run -dp 4200:80 beauty-go-front
