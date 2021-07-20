#!/usr/bin/env bash

set -e
yum install epel-relase wget -y

wget -O /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo
sudo sed -i 's+download.docker.com+mirrors.tuna.tsinghua.edu.cn/docker-ce+' /etc/yum.repos.d/docker-ce.repo
sudo yum makecache fast
sudo yum install -y docker-ce docker-compose

systemctl enable --now docker

docker-compose up -d
