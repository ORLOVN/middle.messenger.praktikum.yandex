FROM ubuntu:latest
RUN apt update && apt install -y nodejs && apt install -y npm
WORKDIR /var/www
RUN npm install express
COPY /prod /prod
COPY server.js .
CMD ls
CMD node server.js
