FROM node:14

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/queue

COPY . /usr/src/queue

# Installing dependencies
RUN npm install
# RUN npm install -g node-gyp
# RUN npm install bcrypt

# RUN cat api.js
CMD ["node", "index.js"]    
