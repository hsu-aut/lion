# layer 1: node to build app
FROM node:latest as build

# install angular
RUN npm install -g @angular/cli

# copy code
COPY ./frontend /usr/local/app/frontend
COPY ./shared /usr/local/app/shared
COPY ./tsconfig.base.json /usr/local/app/

# set workdir
WORKDIR /usr/local/app/frontend

# create package-lock.json first then clean install
RUN npm i --package-lock-only
RUN npm ci

# build app
RUN npm run build

# layer 2: nginx to host app
FROM nginx:latest

# copy built app from build container
COPY --from=build /usr/local/app/frontend/dist /usr/share/nginx/html

# copy proxy conf
COPY /frontend/nginx-default.conf /etc/nginx/conf.d/default.conf