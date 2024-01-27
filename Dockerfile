# build fe
FROM node:21-alpine as build
WORKDIR /fe
COPY . .
RUN npm run i-prod && npm run build

# embedded fe to nginx
FROM nginx:1.25.3-alpine
COPY --from=build /fe/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /fe/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
