FROM node:8.15.1-alpine
COPY . /app
WORKDIR /app
RUN npm install -g @feathersjs/cli