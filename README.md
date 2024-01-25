安装
---
### DOCKER
```bash
docker run -e CLUSTER_ID=xxx -e CLUSTER_SECRET=yyy -v /opt/openbmclapi/cache -p 4000:4000 bangbang93/openbmclapi
```
```bash
docker run -d \
-e CLUSTER_ID=${CLUSTER_ID} \
-e CLUSTER_SECRET=${CLUSTER_SECRET} \
-e CLUSTER_PUBLIC_PORT=${CLUSTER_PORT} \
-v /data/openbmclapi:/opt/openbmclapi/cache \
-p ${CLUSTER_PORT}:4000 \
--restart always \
bangbang93/openbmclapi
```
若无法访问docker hub registry，可以使用国内镜像
```bash
docker pull registry.bangbang93.com/bmclapi/openbmclapi
```

## 配置
| 环境变量                | 必填 | 默认值          | 说明                                                                                                  |
|---------------------|----|--------------|-----------------------------------------------------------------------------------------------------|
| CLUSTER_ID          | 是  | -            | 集群ID                                                                                                |
| CLUSTER_SECRET      | 是  | -            | 集群密钥                                                                                                |
| CLUSTER_IP          | 否  | 出口IP         | 集群IP                                                                                                |
| CLUSTER_PORT        | 否  | 4000         | 监听端口                                                                                                |
| CLUSTER_PUBLIC_PORT | 否  | CLUSTER_PORT | 对外端口                                                                                                |
| CLUSTER_BYOC        | 否  | false        | 是否使用自定义域名,(BYOC=Bring you own certificate),当使用国内服务器需要备案时，需要启用这个参数来使用你自己的域名，并且你需要自己提供ssl termination |
| ENABLE_NGINX        | 否  | false        | 使用nginx提供文件服务                                                                                       |

如果你在源码中发现了其他环境变量，那么它们是为了方便开发而存在的，可能会随时修改，不要在生产环境中使用

## 速度限制
如果使用docker启动进程，可以将cmd设置为`tinc -- trickle -u 10240 node --enable-source-maps dist/index`来限制速度。
此处-u 10240表示限制**上传**速度为10MB/s。

非docker环境可以在宿主机上安装trickle，然后使用trickle来启动nodejs进程，一般的Linux包管理均可直接安装trickle。

具体高级使用方式可以参考trickle的文档


### 安装包
 从 [Github Release](https://github.com/bangbang93/openbmclapi/releases) 中选择对应你的系统的最新版本
 
### 从源码安装
#### 环境
 - nodejs 8以上
 - windows/macOS/linux, x86/arm均可（凡是nodejs支持的环境都可以)
#### 设置环境
 1. 去<https://nodejs.org/zh-cn/>下载LTS版本的nodejs并安装
 2. clone并安装依赖
```bash
git clone https://github.com/bangbang93/openbmclapi
cd openbmclapi
npm ci
npx ts-node src
```
 3. 如果你看到了`missing CLUSTER_PORT`的报错，说明一切正常，该设置参数了


### 设置参数
在项目根目录创建一个文件，名为`.env`

写入如下内容
```
CLUSTER_ID=你的CLUSTER_ID
CLUSTER_SECRET=你的CLUSTER_SECRET
CLUSTER_PORT=对外访问端口
```
CLUSTER_ID和CLUSTER_SECRET请联系我获取

如果配置无误的话，运行程序，就会开始拉取文件，拉取完成后就会开始等待服务器分发请求了

### 同步数据
openbmclapi会自行同步需要的文件，但是初次同步可能会速度过慢，如果您的节点是个全量节点，可以通过以下命令使用rsync快速同步
`rsync -azvP openbmclapi@home.933.moe::openbmclapi cache`
