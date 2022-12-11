# ubuntu as base
FROM ubuntu:22.04

# install stuff
# node.js and npm
# java for graph db
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends nodejs npm default-jre curl unzip sudo git-all

# update nodejs to latest stable
RUN npm cache clean -f \
    && npm install -g n \
    && n stable

# install angular using npm
RUN npm install -g @angular/cli

# add user "lion" with password "lion" and sudo rights and enable sudo rights without password
RUN useradd -m lion -p $(openssl passwd lion)
RUN usermod -aG sudo lion
RUN echo "lion ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# # download graphdb
RUN mkdir "/usr/lib/graphdb-zip" \
    && mkdir "/usr/lib/graphdb" \
    && mkdir "/usr/lib/graphdb/data" \
    && curl -o "/usr/lib/graphdb-zip/graphdb.zip" "https://maven.ontotext.com/repository/owlim-releases/com/ontotext/graphdb/graphdb/10.0.0/graphdb-10.0.0-dist.zip" \
    && unzip "/usr/lib/graphdb-zip/graphdb.zip" -d "/usr/lib/graphdb" \
    && rm -r "/usr/lib/graphdb-zip"