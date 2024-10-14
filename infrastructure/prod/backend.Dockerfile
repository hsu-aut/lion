# node to build and run app
FROM node:latest

# install nest
RUN npm install -g @nestjs/cli

# copy code
COPY ./backend /usr/local/app/backend
COPY ./shared /usr/local/app/shared
COPY ./tsconfig.base.json /usr/local/app/

# set workdir
WORKDIR /usr/local/app/backend

# create package-lock.json first then clean install
RUN npm i --package-lock-only
RUN npm ci

# build app
RUN npm run build

# start app
CMD ["npm", "run", "start:prod"]

# # expose port 3000
EXPOSE 3000