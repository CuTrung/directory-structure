FROM nginx:1.16.0-alpine
WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d
COPY . .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]  

