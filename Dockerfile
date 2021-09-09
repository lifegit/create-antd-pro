# download dependencies and build code
FROM circleci/node:erbium-stretch-browsers-legacy as builder
WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN yarn --registry https://registry.npm.taobao.org
COPY ./ ./
RUN yarn build

# install nginx
FROM nginx
WORKDIR /usr/share/nginx/html/
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/

# run
EXPOSE 80
ENTRYPOINT ["nginx","-g", "daemon off;", "-other", "flags"]
