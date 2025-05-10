FROM node:latest as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli

COPY . .

RUN npm run build --configuration=production

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/beauty-go/browser /usr/share/nginx/html

EXPOSE 80

#docker build -t beauty-go-front .
#docker run -dp 4200:80 beauty-go-front
