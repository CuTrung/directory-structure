# build fe
FROM node:20-alpine 
WORKDIR /be
COPY . .
RUN npm run i-prod 
CMD [ "npm", "run", "prod" ]