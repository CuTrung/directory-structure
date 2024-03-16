# build 
FROM node:20-alpine as build
WORKDIR /be
COPY package*.json .
RUN npm run i-prod 
COPY . .
RUN npm run build


# run
FROM node:20-alpine 
WORKDIR /be
COPY --from=build be/package*.json .
RUN npm run i-prod 
COPY --from=build /be/dist dist
CMD [ "npm", "run", "prod" ]