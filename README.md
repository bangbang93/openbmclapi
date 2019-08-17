安装
---
### DOCKER
```bash
docker run -e CLUSTER_ID=xxx -e CLUSTER_SECRET=yyy -p 4000:4000 bangbang93/openbmclapi
```

若要使用不同端口，请添加CLUSTER_PUBLIC_PORT环境变量以修改上报端口

### 安装包
 TODO
 
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
#### 设置参数
在项目根目录创建一个文件，名为`.env`

写入如下内容
```
CLUSTER_ID=你的CLUSTER_ID
CLUSTER_SECRET=你的CLUSTER_SECRET
CLUSTER_PORT=对外访问端口
```
CLUSTER_ID和CLUSTER_SECRET请联系我获取

如果配置无误的话，就会开始拉取文件，拉取完成后就会开始等待服务器分发请求了
