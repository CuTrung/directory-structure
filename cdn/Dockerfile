FROM node:16
ENV PORT 3000
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE ${PORT}
CMD ["node", "index.js"]
