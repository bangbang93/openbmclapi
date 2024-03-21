# BMCLAPI
BMCLAPI是@bangbang93开发的BMCL的一部分，用于解决国内线路对Forge和Minecraft官方使用的Amazon S3 速度缓慢的问题。BMCLAPI是对外开放的，所有需要Minecraft资源的启动器均可调用。


# OpenBMCLAPI
这个项目的主要目的是辅助bmclapi分发文件
对节点的要求降低了不少

1. 公网可访问（端口映射也可），可以非80
2. 10Mbps以上的上行速度
3. 暂时不接受国外节点了
4. 可以长时间稳定在线
5. 暂不支持IPv6 only(可以双栈)

[Wiki](https://github.com/bangbang93/openbmclapi/wiki)

- 如果你是家庭宽带打算参与，配置信息可以参考 [家宽搭建说明](https://github.com/bangbang93/openbmclapi/wiki/%E5%AE%B6%E5%AE%BD%E6%90%AD%E5%BB%BA%E8%AF%B4%E6%98%8E)

- 如果你是国内服务器打算参与，配置信息可以参考 [国内服务器搭建说明](https://github.com/bangbang93/openbmclapi/wiki/%E5%9B%BD%E5%86%85%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%90%AD%E5%BB%BA%E8%AF%B4%E6%98%8E)

安装
---

### Docker Cli

如果你不熟悉docker，可以参考[Docker部署指北](https://github.com/bangbang93/openbmclapi/wiki/docker%E9%83%A8%E7%BD%B2%E6%8C%87%E5%8C%97)

```bash
docker run -d \
-e CLUSTER_ID=${CLUSTER_ID} \
-e CLUSTER_SECRET=${CLUSTER_SECRET} \
-e CLUSTER_PUBLIC_PORT=${CLUSTER_PORT} \
-e TZ=Asia/Shanghai \
-v /data/openbmclapi:/opt/openbmclapi/cache \
-p ${CLUSTER_PORT}:4000 \
--restart always \
--name openbmclapi \
bangbang93/openbmclapi
```

若无法访问 Docker Hub Registry, 可以使用国内镜像:

```bash
docker pull registry.bangbang93.com/bmclapi/openbmclapi
```

### Docker Compose
请先根据 [设置参数](#设置参数) 中说明的内容创建 `.env` 文件或直接更改 `docker-compose.yml` 文件, 然后运行以下命令:

```bash
docker compose up -d
```

## 配置

| 环境变量                | 必填 | 默认值          | 说明                                                                                                     |
|---------------------|----|--------------|--------------------------------------------------------------------------------------------------------|
| CLUSTER_ID          | 是  | -            | 集群 ID                                                                                                  |
| CLUSTER_SECRET      | 是  | -            | 集群密钥                                                                                                   |
| CLUSTER_IP          | 否  | 自动获取公网出口IP   | 用户访问时使用的 IP 或域名                                                                                        |
| CLUSTER_PORT        | 否  | 4000         | 监听端口                                                                                                   |
| CLUSTER_PUBLIC_PORT | 否  | CLUSTER_PORT | 对外端口                                                                                                   |
| CLUSTER_BYOC        | 否  | false        | 是否使用自定义域名, (BYOC=Bring you own certificate),当使用国内服务器需要备案时, 需要启用这个参数来使用你自己的域名, 并且你需要自己提供ssl termination |
| ENABLE_NGINX        | 否  | false        | 使用 nginx 提供文件服务                                                                                        |
| DISABLE_ACCESS_LOG  | 否  | false        | 禁用访问日志输出                                                                                               |
| ENABLE_UPNP         | 否  | false        | 启用 UPNP 端口映射                                                                                           |

如果你在源码中发现了其他环境变量, 那么它们是为了方便开发而存在的, 可能会随时修改, 不要在生产环境中使用

### 安装包

从 [Github Release](https://github.com/bangbang93/openbmclapi/releases) 中选择对应你的系统的最新版本

### 从源码安装

#### 环境

- Node.js 18以上
- Windows/MacOS/Linux, x86/arm均可 (凡是nodejs支持的环境都可以)

#### 设置环境

1. 去 <https://nodejs.org/zh-cn/> 下载LTS版本的nodejs并安装
2. Clone 并安装依赖

```bash
git clone https://github.com/bangbang93/openbmclapi
cd openbmclapi
## 安装依赖
npm ci
## 编译
npm run build
## 运行
node dist/index.js
```

3. 如果你看到了 `CLUSTER_ID is not set` 的报错, 说明一切正常, 该设置参数了

### 设置参数

在项目根目录创建一个文件, 名为 `.env`

写入如下内容

```env
CLUSTER_ID=你的CLUSTER_ID
CLUSTER_SECRET=你的CLUSTER_SECRET
CLUSTER_PORT=对外访问端口
```

CLUSTER_ID 和 CLUSTER_SECRET 请联系我获取

如果配置无误的话, 运行程序, 就会开始拉取文件, 拉取完成后就会开始等待服务器分发请求了

### 同步数据

openbmclapi 会自行同步需要的文件, 但是初次同步可能会速度过慢, 如果您的节点是个全量节点, 可以通过以下命令使用rsync快速同步
以下三台rsync服务器是相同的, 你可以选择任意一台进行同步
- `rsync -rzvP openbmclapi@home.933.moe::openbmclapi cache`
- `rsync -avP openbmclapi@storage.yserver.ink::bmcl cache`
- `rsync -azvrhP openbmclapi@openbmclapi.home.mxd.moe::volume cache`
