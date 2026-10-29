# Changelog

#### [v1.15.0](https://github.com/bangbang93/openbmclapi/compare/v1.14.0...v1.15.0)

#### [v1.15.0](https://github.com/bangbang93/openbmclapi/compare/v1.14.0...v1.15.0)

> 29 October 2026

- feat: 优化CDN节点体验与方便溯源节点 [`#144`](https://github.com/bangbang93/openbmclapi/pull/144)
- chore(deps): bump socket.io-parser from 4.2.6 to 4.2.7 [`#142`](https://github.com/bangbang93/openbmclapi/pull/142)
- chore(deps): bump brace-expansion, eslint and rimraf [`#141`](https://github.com/bangbang93/openbmclapi/pull/141)
- chore(deps): bump body-parser from 1.20.5 to 1.20.6 [`#139`](https://github.com/bangbang93/openbmclapi/pull/139)
- chore(deps): bump ws and engine.io-client [`#138`](https://github.com/bangbang93/openbmclapi/pull/138)
- chore(deps-dev): bump flatted from 3.3.1 to 3.4.2 [`#128`](https://github.com/bangbang93/openbmclapi/pull/128)
- chore(deps): bump socket.io-parser from 4.2.4 to 4.2.6 [`#127`](https://github.com/bangbang93/openbmclapi/pull/127)
- chore(deps): bump fast-xml-parser from 4.4.1 to 4.5.4 [`#126`](https://github.com/bangbang93/openbmclapi/pull/126)
- chore(deps): bump minimatch [`#125`](https://github.com/bangbang93/openbmclapi/pull/125)
- chore(deps): bump qs and express [`#123`](https://github.com/bangbang93/openbmclapi/pull/123)
- chore(deps): bump lodash from 4.17.21 to 4.17.23 [`#122`](https://github.com/bangbang93/openbmclapi/pull/122)
- chore(deps): bump lodash-es from 4.17.21 to 4.17.23 [`#121`](https://github.com/bangbang93/openbmclapi/pull/121)
- chore(deps-dev): bump glob from 10.3.10 to 10.5.0 [`#119`](https://github.com/bangbang93/openbmclapi/pull/119)
- chore(deps-dev): bump js-yaml from 4.1.0 to 4.1.1 [`#117`](https://github.com/bangbang93/openbmclapi/pull/117)
- chore(deps): bump brace-expansion [`#115`](https://github.com/bangbang93/openbmclapi/pull/115)
- chore(deps): bump on-headers and morgan [`#114`](https://github.com/bangbang93/openbmclapi/pull/114)
- fix: 修复检查端口失败后依然执行启用 [`#109`](https://github.com/bangbang93/openbmclapi/pull/109)
- docs：更详细的README [`#103`](https://github.com/bangbang93/openbmclapi/pull/103)
- chore: migrate from npm to pnpm [`10c45e4`](https://github.com/bangbang93/openbmclapi/commit/10c45e4aa6dd6d9d2975701d3bc1e3d94753523c)
- fix(ci): upgrade @typescript-eslint/parser to ^8.61.0 to fix eslint crash [`395b686`](https://github.com/bangbang93/openbmclapi/commit/395b6868edcd9277b10fe44a977311b485c88e01)
- chore: npm audit fix [`21f5bb6`](https://github.com/bangbang93/openbmclapi/commit/21f5bb698039234eebe39a49627733af6f046e60)
- feat: oss storage [`1c70040`](https://github.com/bangbang93/openbmclapi/commit/1c70040d0c9aa824b17638a50435249550a8a4e5)
- ci: 引入 vitest 测试框架并接入 CI [`7d1ba6f`](https://github.com/bangbang93/openbmclapi/commit/7d1ba6fb07eeffee961d9bbe4488fa4efd290ca3)
- build: upgrade express to 5 [`a3a934e`](https://github.com/bangbang93/openbmclapi/commit/a3a934e39bb20e36decfc9864b348f583063d723)
- fix: replace http2-express-bridge with http2-express (dead dependency with unfixed send vulnerability) [`9ef74a8`](https://github.com/bangbang93/openbmclapi/commit/9ef74a8b43d824a4a0dde970f9cdaf51f12299d3)
- fix: enable 失败不再立即下线退出，改为退避重试，连续失败 30 分钟才放弃 [`713233b`](https://github.com/bangbang93/openbmclapi/commit/713233bb5dd00b418c0a32f9d703967f56b1b7f8)
- refactor: 合并getSize方法 [`926d8f3`](https://github.com/bangbang93/openbmclapi/commit/926d8f330085bfd5f39758c381e21770ff29be1c)
- fix(deps): upgrade undici to 6.24.0 to resolve security vulnerabilities [`402a91c`](https://github.com/bangbang93/openbmclapi/commit/402a91c6140cf81a30a962c2d4a419bdac30c015)
- ci: upgrade GitHub Actions to latest majors (node 24 runtime) [`06274c3`](https://github.com/bangbang93/openbmclapi/commit/06274c3793c2914a26d0abc83b8b1e8006d14148)
- Release 1.15.0 [`64f95e5`](https://github.com/bangbang93/openbmclapi/commit/64f95e5b1e01b92e4821cf80f7558ad6a3b3a114)
- fix: checkFile 将增量按 path 合并进全量列表后再同步，修复新文件永远不被下载的问题 [`6e9c2c2`](https://github.com/bangbang93/openbmclapi/commit/6e9c2c2bb78efcdf3fc9155dde5f8036ff5c9292)
- feat: 给minio存储上一个检查文件是否存在的cache [`0a6e0ab`](https://github.com/bangbang93/openbmclapi/commit/0a6e0abbd46edb6830b1233ac5a13f5da1d61a12)
- feat: oss支持非代理模式 [`f531828`](https://github.com/bangbang93/openbmclapi/commit/f53182846ce936facde4f6559cc5b9c5d624363f)
- ci: switch GitHub Actions to pnpm [`addad35`](https://github.com/bangbang93/openbmclapi/commit/addad356cddeef4b9f13d77dfd4bf2116b7f5b02)
- ci: fix pnpm setup with pnpm/action-setup and node 22 matrix [`52b5d69`](https://github.com/bangbang93/openbmclapi/commit/52b5d691808f308ead48a11c9d1be3fdbc327f17)
- build: use pnpm in Dockerfile [`235307d`](https://github.com/bangbang93/openbmclapi/commit/235307de6f648d7d2b3bbaf7b33f1933e47538d5)
- fix: migrate route regex params for express 5 (path-to-regexp v8) [`b682dbd`](https://github.com/bangbang93/openbmclapi/commit/b682dbd1dc52050dca1548e57ef05f6ac97cefd6)
- fix: 移除 got cache 选项，修复 keyv error 监听器泄漏（cacheable-request 13.x，上游未发版） [`4f9b38d`](https://github.com/bangbang93/openbmclapi/commit/4f9b38d713c671b1852dcbf77e4ed53a31fc0298)
- fix: nginx模式适配DISABLE_SIGN与x-bmclapi-id [`50092b3`](https://github.com/bangbang93/openbmclapi/commit/50092b34bc846bc7f2b8da683db949e4fc5622a5)
- style: fix eslint [`30d385c`](https://github.com/bangbang93/openbmclapi/commit/30d385cbc8a8286a788575d6a3dda5f006130f5b)
- fix: server.close 加 60 秒强制退出兜底，避免存量连接导致僵尸进程 [`8aba23c`](https://github.com/bangbang93/openbmclapi/commit/8aba23c148024ca61a0630a261eca609f0789b2b)
- docs: update source install guide to pnpm [`f0285c2`](https://github.com/bangbang93/openbmclapi/commit/f0285c2623769b2c43ebc58c518ec9b447e687c5)
- chore: Add context7.json [`4f0e569`](https://github.com/bangbang93/openbmclapi/commit/4f0e569a910fe4878b3d131eb30a4637572bf341)
- feat: oss支持指定endpoint和cname [`63dcaf7`](https://github.com/bangbang93/openbmclapi/commit/63dcaf75167e9c7c2cf712b82cdfdd67fcae4b44)
- feat: randomize backoff time for worker restarts [`88f6039`](https://github.com/bangbang93/openbmclapi/commit/88f6039243f32a835a3cfed1d5f9bf03f5baa94f)
- feat: 允许禁用签名校验 [`729fdbb`](https://github.com/bangbang93/openbmclapi/commit/729fdbbb77a169c5a9b04d64caed807a44fd3aec)
- feat: 在下载的HTTP头中添加ClusterId [`8a23dc7`](https://github.com/bangbang93/openbmclapi/commit/8a23dc7a3c8191bc3597511213a3acd72f670a9a)
- chore: align engines with pnpm 11 requirement (node &gt;=22.13) [`ac97f2b`](https://github.com/bangbang93/openbmclapi/commit/ac97f2b33eb6f7429eb87ad01b569a9fe98f3bd8)
- chore: ignore .omo directory [`dd3eeac`](https://github.com/bangbang93/openbmclapi/commit/dd3eeac7e272a3c02d794429b332d2a3114e3770)
- build: use node 22 bookworm base image (bullseye is EOL) [`a332af4`](https://github.com/bangbang93/openbmclapi/commit/a332af4d073fc7e0c85ecea8080034b146b24775)
- build: bump Docker base image to node 22 for pnpm 11 [`168677b`](https://github.com/bangbang93/openbmclapi/commit/168677b5f1871061173624205f4be8c3205f739a)
- fix: 修正oss文件回收 [`cee4de5`](https://github.com/bangbang93/openbmclapi/commit/cee4de5ed01b6ecad2685c868aa2536cf7865a79)
- docs：去除了多余的D [`190ba97`](https://github.com/bangbang93/openbmclapi/commit/190ba973ae44206a29e10f2acd05a23f8246f632)
- chore: 提交 .opencode/.gitignore，忽略其中的会话图片 [`4e0ae7d`](https://github.com/bangbang93/openbmclapi/commit/4e0ae7d17ca1a762ec1c2c6f476180ce808dde82)
- docs: 添加DISABLE_SIGN的相关描述 [`2ffd1a8`](https://github.com/bangbang93/openbmclapi/commit/2ffd1a8e9560dab4453a2ac9da6161aa6cc95c9a)

#### [v1.14.0](https://github.com/bangbang93/openbmclapi/compare/v1.13.1...v1.14.0)

> 13 April 2025

- docs: 修改rsync的volume [`#102`](https://github.com/bangbang93/openbmclapi/pull/102)
- chore(deps): bump path-to-regexp and express [`#97`](https://github.com/bangbang93/openbmclapi/pull/97)
- chore(deps): bump cross-spawn from 7.0.3 to 7.0.6 [`#96`](https://github.com/bangbang93/openbmclapi/pull/96)
- feat: fix #104 [`#104`](https://github.com/bangbang93/openbmclapi/issues/104)
- feat: 支持minio storage [`2f09090`](https://github.com/bangbang93/openbmclapi/commit/2f0909040d6420bd63dab2c1f421273fce700534)
- feat: 使用ipaddr.js替换ip [`f217fd7`](https://github.com/bangbang93/openbmclapi/commit/f217fd73dce86a1bfde3d7ede84b673f197d6ee6)
- refactor: 先监听端口，后请求上线 [`fee77dd`](https://github.com/bangbang93/openbmclapi/commit/fee77dd7c66aaa87377ef97551e34c5d6191a00d)
- feat: 给个内部client的支持 [`1daffd9`](https://github.com/bangbang93/openbmclapi/commit/1daffd92960dc730438621fb68a8a4742a08e812)
- Release 1.14.0 [`dd8cadc`](https://github.com/bangbang93/openbmclapi/commit/dd8cadcbf0aea0d72056520a82fda86a4e1275d2)
- feat: 支持端口预检查 [`4c0ca62`](https://github.com/bangbang93/openbmclapi/commit/4c0ca627635d3e52b244a4c6ee0051c365c47031)
- feat: minio下载时保留文件名 [`4cd2d59`](https://github.com/bangbang93/openbmclapi/commit/4cd2d591f0c863ffb067047f4c593850a8494a32)
- fix: 修正endpoint [`f49e488`](https://github.com/bangbang93/openbmclapi/commit/f49e4884b5f2b9609fda2e3252e289c904863dd7)
- feat: 给个region参数的支持 [`995ed41`](https://github.com/bangbang93/openbmclapi/commit/995ed419b0611beb2fe7754a1247af1dc04613a1)

#### [v1.13.1](https://github.com/bangbang93/openbmclapi/compare/v1.13.0...v1.13.1)

> 30 November 2024

- Release 1.13.1 [`5316954`](https://github.com/bangbang93/openbmclapi/commit/5316954f8aa69e755a388385326b9dcc377d2b0e)
- fix: upnp port check [`49b20ad`](https://github.com/bangbang93/openbmclapi/commit/49b20ad04fa78bb9ab9c04a4dc32f2eeabaa25e5)
- docs: 增加环境变量说明 [`d892e4a`](https://github.com/bangbang93/openbmclapi/commit/d892e4a71571236bea9f8fb6653de4d8d77614d7)

#### [v1.13.0](https://github.com/bangbang93/openbmclapi/compare/v1.12.1...v1.13.0)

> 29 November 2024

- chore(deps): bump path-to-regexp and express [`#86`](https://github.com/bangbang93/openbmclapi/pull/86)
- chore: upgrade eslint [`58d10ed`](https://github.com/bangbang93/openbmclapi/commit/58d10edbcab026d68b8cf4d455cca7f9a8134325)
- chore: upgrade express [`d2b4046`](https://github.com/bangbang93/openbmclapi/commit/d2b40460a1bd1a39285331f8bd4bd66c1d14a85f)
- feat: 检查UPnP返回的ip是否为公网IP [`bc73ed1`](https://github.com/bangbang93/openbmclapi/commit/bc73ed15b251fd1e4ea41a8794b355ee16605b87)
- feat: 支持使用自定义证书 [`b03dc2f`](https://github.com/bangbang93/openbmclapi/commit/b03dc2f5fdf0c1b1e5579904dec1e871dbb75969)
- Release 1.13.0 [`edb9d8c`](https://github.com/bangbang93/openbmclapi/commit/edb9d8cec0c8c7cd5ed9a7d5a7772d933edf240f)
- fix: 修正byoc但是自带证书的监听逻辑 [`e7009c3`](https://github.com/bangbang93/openbmclapi/commit/e7009c3c844ba1867231e16e0e08e607e1e9c58e)
- fix: fix copy [`d56cee7`](https://github.com/bangbang93/openbmclapi/commit/d56cee7aa46c465120ea25998fc8de7e436789cb)
- fix: 修正ip.isPrivate [`45bdac6`](https://github.com/bangbang93/openbmclapi/commit/45bdac67ee50e85d5e7877bfa38945d6aedc4b60)
- chore: 爱发电的域名换了 [`021d731`](https://github.com/bangbang93/openbmclapi/commit/021d73105e0a77c4c94c2fe292877db5f63973d9)
- feat: 调整主控白名单策略，简化第三方主控接入 [`f783250`](https://github.com/bangbang93/openbmclapi/commit/f783250fa836022ac325ec2c1c47081e01826830)

#### [v1.12.1](https://github.com/bangbang93/openbmclapi/compare/v1.12.0...v1.12.1)

> 21 September 2024

- feat: 回收文件给个完成提示 [`f5299ae`](https://github.com/bangbang93/openbmclapi/commit/f5299ae96649b421a4210496f813e4a4ef3e4053)
- Release 1.12.1 [`a0d68c1`](https://github.com/bangbang93/openbmclapi/commit/a0d68c17621a5201c78b40f3816996cf49e436f7)
- fix: 修正使用shell运行时，ctrl+c优雅下线有概率不生效 [`6dc0170`](https://github.com/bangbang93/openbmclapi/commit/6dc01707340bea863b8da15eebcee330faa5cad0)
- chore: upgrade sync-mirror workflow [`cb762de`](https://github.com/bangbang93/openbmclapi/commit/cb762de4580a96b66fd0a0154399baa100a27e5a)
- fix: on stop时就不要给异常退出的日志了 [`7850fff`](https://github.com/bangbang93/openbmclapi/commit/7850fffdba01b6832d1afa873f95e9d0a0e00da0)

#### [v1.12.0](https://github.com/bangbang93/openbmclapi/compare/v1.11.0...v1.12.0)

> 19 September 2024

- chore(deps): bump fast-xml-parser from 4.3.4 to 4.4.1 [`#80`](https://github.com/bangbang93/openbmclapi/pull/80)
- chore(deps-dev): bump braces from 3.0.2 to 3.0.3 [`#76`](https://github.com/bangbang93/openbmclapi/pull/76)
- chore(deps): bump ws and engine.io-client [`#79`](https://github.com/bangbang93/openbmclapi/pull/79)
- chore(deps): bump express from 4.18.1 to 4.19.2 [`#66`](https://github.com/bangbang93/openbmclapi/pull/66)
- chore: remove pkg [`14543d3`](https://github.com/bangbang93/openbmclapi/commit/14543d36d719868b868d2ac1671657fdccf31ef3)
- feat: 优化异常信息展示 [`cfe0bda`](https://github.com/bangbang93/openbmclapi/commit/cfe0bda60b8a037e2cc6055bad9f2694412e5dab)
- Release 1.12.0 [`2d14415`](https://github.com/bangbang93/openbmclapi/commit/2d14415f08e1bcceb08f3e5bd15bbd18609f1406)
- feat: webdav的exists检查给个缓存，减轻alist压力 [`22b72b5`](https://github.com/bangbang93/openbmclapi/commit/22b72b5507236c9ff5cc42a60a0478523bd236c8)
- chore: docker再拆一个构建阶段 [`a645ff8`](https://github.com/bangbang93/openbmclapi/commit/a645ff8456e9b63d1bfa4d2908a16e60f9415903)
- fix: 先判断body类型 [`9bc3f78`](https://github.com/bangbang93/openbmclapi/commit/9bc3f781edef689725aedb54439885f20b845101)
- fix: 改为向子进程发送signal，而不是直接disconnect [`33afcfd`](https://github.com/bangbang93/openbmclapi/commit/33afcfd911d38792a89c6075f0d01dd499ace2e9)
- feat: 接收主控的巡检异常回报 [`abcd0a5`](https://github.com/bangbang93/openbmclapi/commit/abcd0a5fdc16650128831d9e102bfc9e3832e793)
- feat: 给alist-webdav.storage.ts获取地址一个30s的超时时间 [`c81caa7`](https://github.com/bangbang93/openbmclapi/commit/c81caa7839f794c24fa6d19b5db636ac8d6dbfa1)
- chore: docker打包漏了package.json [`b7b52c3`](https://github.com/bangbang93/openbmclapi/commit/b7b52c3e58c942d0012245fe145a5fac600afdf3)

#### [v1.11.0](https://github.com/bangbang93/openbmclapi/compare/v1.11.0-4...v1.11.0)

> 21 June 2024

- feat: 下载错误上报 [`#78`](https://github.com/bangbang93/openbmclapi/pull/78)
- refactor: 把authRoute拆出去 [`9d5867d`](https://github.com/bangbang93/openbmclapi/commit/9d5867d409f0661e35affee573dbd0ba6ded683b)
- feat: 允许自定义alist缓存时间 [`f903821`](https://github.com/bangbang93/openbmclapi/commit/f903821a9475ebcfb388ed77debdd92a47799534)
- feat: 把校验失败也算进重试里 [`08e9cf6`](https://github.com/bangbang93/openbmclapi/commit/08e9cf680e3d43e2c674c7d6ebd1b5c0bac2e839)
- Release 1.11.0 [`22cbee0`](https://github.com/bangbang93/openbmclapi/commit/22cbee01c172601cc9095da445ba903d9437fd75)
- fix: 移除已经没用的FORCE_NOOPEN参数 [`787a8d3`](https://github.com/bangbang93/openbmclapi/commit/787a8d364460dcdc3f9ff88febd7836cd979bc46)

#### [v1.11.0-4](https://github.com/bangbang93/openbmclapi/compare/v1.11.0-3...v1.11.0-4)

> 19 June 2024

- fix: 修正异常上报 [`6c5e3b8`](https://github.com/bangbang93/openbmclapi/commit/6c5e3b8c1cf8f79a447c55806a9eb0bdededef1b)
- Release 1.11.0-4 [`be407a7`](https://github.com/bangbang93/openbmclapi/commit/be407a71e40c82a54f35db0ba887e1faf2e4bb02)
- feat: 移除noopen参数 [`fecb72a`](https://github.com/bangbang93/openbmclapi/commit/fecb72ad5a75730697212bdfd914714c4adc2e29)

#### [v1.11.0-3](https://github.com/bangbang93/openbmclapi/compare/v1.11.0-2...v1.11.0-3)

> 18 June 2024

- refactor: 简化上报的错误 [`03400c5`](https://github.com/bangbang93/openbmclapi/commit/03400c543cd73d6abe64481cecc12a221aef93c1)
- Release 1.11.0-3 [`750b711`](https://github.com/bangbang93/openbmclapi/commit/750b711e467b3f992672bcbf3c4c2072b79e45b0)

#### [v1.11.0-2](https://github.com/bangbang93/openbmclapi/compare/v1.11.0-1...v1.11.0-2)

> 18 June 2024

- fix: 修正错误上报 [`ba027be`](https://github.com/bangbang93/openbmclapi/commit/ba027be00f11e1fab76aa974cd625c37b3c3079b)
- Release 1.11.0-2 [`84ca717`](https://github.com/bangbang93/openbmclapi/commit/84ca717eda91a2f2735ec02465d162dec0224750)

#### [v1.11.0-1](https://github.com/bangbang93/openbmclapi/compare/v1.11.0-0...v1.11.0-1)

> 18 June 2024

- fix: 应该在下载失败的时候就上报了，不应该等到重试失败 [`1f933f8`](https://github.com/bangbang93/openbmclapi/commit/1f933f89489aa808a7d02f983845c25389eb4de1)
- Release 1.11.0-1 [`ca5fa71`](https://github.com/bangbang93/openbmclapi/commit/ca5fa715391721f327079089480d38115fc62a97)

#### [v1.11.0-0](https://github.com/bangbang93/openbmclapi/compare/v1.10.10...v1.11.0-0)

> 18 June 2024

- feat: 下载错误时上报主控 [`19149d5`](https://github.com/bangbang93/openbmclapi/commit/19149d50d8a8cc90b72a8989d17dd95eeb9b3289)
- Release 1.11.0-0 [`ff77a85`](https://github.com/bangbang93/openbmclapi/commit/ff77a85530b643a72e1cbc5d60f8aaabc451121f)

#### [v1.10.10](https://github.com/bangbang93/openbmclapi/compare/v1.10.9...v1.10.10)

> 13 June 2024

- feat: 同时执行gc与启用 [`#77`](https://github.com/bangbang93/openbmclapi/pull/77)
- feat: clean outdated files after enabled [`#75`](https://github.com/bangbang93/openbmclapi/pull/75)
- feat: 简化emit异步写法 [`1a6c0bb`](https://github.com/bangbang93/openbmclapi/commit/1a6c0bb0cc436a9070d44719ada550708bad2237)
- feat: nginx upstream keepalive [`d3d940c`](https://github.com/bangbang93/openbmclapi/commit/d3d940c364ac73b92ee60d4af83ac7685c2fafe5)
- chore: Add GitHub Actions workflow for building and linting [`8adeb62`](https://github.com/bangbang93/openbmclapi/commit/8adeb6263c08e95d26f81f4f17c91874d2f8f1bd)
- fix: 优化优雅退出 [`c1b0fb2`](https://github.com/bangbang93/openbmclapi/commit/c1b0fb2f87fce18c7c0dc4c3b9f2e79fffd2a798)
- fix: nginx配置异常时不要尝试上线 [`9f5e491`](https://github.com/bangbang93/openbmclapi/commit/9f5e491115ed9a6535e894e011f1de2accd55149)
- Release 1.10.10 [`ecccf3a`](https://github.com/bangbang93/openbmclapi/commit/ecccf3ae0f03f1032e7853334b8e19c3951529a4)
- feat: 优化下载重试日志 [`af6072e`](https://github.com/bangbang93/openbmclapi/commit/af6072ecc66c5f0d459afc1f141ca7948b1021e6)
- style: enforce prettier [`462029d`](https://github.com/bangbang93/openbmclapi/commit/462029d235c2ffc4865e0a5f71d052829c196280)
- Update bootstrap.ts [`0b8f595`](https://github.com/bangbang93/openbmclapi/commit/0b8f595c5468ad7b8aa4b8f810d71358e2272c7a)
- chore: format [`7d1b659`](https://github.com/bangbang93/openbmclapi/commit/7d1b659cb5876d6c0bedeba048618565cb797f5a)
- feat: 再给两行日志 [`c616a5a`](https://github.com/bangbang93/openbmclapi/commit/c616a5a848bec92930c08a2565760b303cda1523)
- Update bootstrap.ts [`d590250`](https://github.com/bangbang93/openbmclapi/commit/d59025064280513ae92899b578a777964a0547a1)
- Update bootstrap.ts [`b895108`](https://github.com/bangbang93/openbmclapi/commit/b89510854651b04e656565fc6333a41ebaa90996)
- fix: 掉线后禁用keep-alive [`f9980c7`](https://github.com/bangbang93/openbmclapi/commit/f9980c7723c1ffd731cf2639bc7b7687db1cf893)

#### [v1.10.9](https://github.com/bangbang93/openbmclapi/compare/v1.10.8...v1.10.9)

> 3 June 2024

- refactor: 使用env-var校验环境变量 [`45e22b3`](https://github.com/bangbang93/openbmclapi/commit/45e22b320ec530a8ebdf848d2dba375ad4f85a9d)
- feat: webdav并行检查 [`82f0792`](https://github.com/bangbang93/openbmclapi/commit/82f0792cebf78a05748570f822a8d34df3e597c6)
- Release 1.10.9 [`8d2e37d`](https://github.com/bangbang93/openbmclapi/commit/8d2e37da95662559e40d981e007d0e502c73e83d)
- refactor: 简化文件列表 [`409d335`](https://github.com/bangbang93/openbmclapi/commit/409d3350626583d5f0087680c7697ce5f50857d0)
- refactor: 改为while循环，并且将起始counter设置为1 [`0f00f24`](https://github.com/bangbang93/openbmclapi/commit/0f00f24cf1d52d9f56d8b173808d8d89e87768a7)
- feat: 再给个总进度 [`43a20f4`](https://github.com/bangbang93/openbmclapi/commit/43a20f40fd4edc2e1b19189fd04a1b31364cd4c6)
- chore: 忽略删除临时文件失败，仅打印警告日志 [`84bcd2d`](https://github.com/bangbang93/openbmclapi/commit/84bcd2d12f329bfe55eaeffc3757c49f72f69e11)
- fix: 同步成功后再修改本地文件列表，避免单次同步失败忽略部分文件 [`9286e9f`](https://github.com/bangbang93/openbmclapi/commit/9286e9fe44823b5828176f3c134a99048b4dde9f)

#### [v1.10.8](https://github.com/bangbang93/openbmclapi/compare/v1.10.7...v1.10.8)

> 20 May 2024

- Release 1.10.8 [`7d45057`](https://github.com/bangbang93/openbmclapi/commit/7d45057b3908ebb9dac877e00aab7ad6b5b521c9)
- fix: fix package import [`9d12472`](https://github.com/bangbang93/openbmclapi/commit/9d12472d90187c7e4caeb21b38c64673d0f5bf26)
- fix: 重试下载的时候给个debug日志，并且重置进度条 [`c7fec2f`](https://github.com/bangbang93/openbmclapi/commit/c7fec2f84a954ea608c3784fe4ad1eacdc58237d)

#### [v1.10.7](https://github.com/bangbang93/openbmclapi/compare/v1.10.6...v1.10.7)

> 20 May 2024

- Release 1.10.7 [`e7675b3`](https://github.com/bangbang93/openbmclapi/commit/e7675b32b7b6d447ffcd7ec30a9d2fb1447a10be)
- chore: 简化错误日志 [`755d107`](https://github.com/bangbang93/openbmclapi/commit/755d10742d85d216a30276af61bd8667b11c8e06)
- fix: 修正本地存储目录创建 [`0a4c744`](https://github.com/bangbang93/openbmclapi/commit/0a4c744ca6140eefdb8c84dafce7c851011d96f8)
- fix: 修正下载retry [`97311d0`](https://github.com/bangbang93/openbmclapi/commit/97311d0800f4d68449c8c2c99c0d6c5c36f8e483)
- chore: 给点日志 [`e1bff2a`](https://github.com/bangbang93/openbmclapi/commit/e1bff2adcbf4fc2711c14d5dc2e7de67c780ffae)

#### [v1.10.6](https://github.com/bangbang93/openbmclapi/compare/v1.10.5...v1.10.6)

> 16 May 2024

- chore: 国内镜像改用kaniko构建 [`79afa28`](https://github.com/bangbang93/openbmclapi/commit/79afa2877edb522f7a0692875d3a2836a90632ae)
- fix: 同步前检查存储是否可以正常写入，避免无效同步 [`1ff4cb3`](https://github.com/bangbang93/openbmclapi/commit/1ff4cb3dcd88dabd7c37788ddad861f637bac09f)
- fix: 被踹时不要硬退出，改为软重启 [`7bc0c86`](https://github.com/bangbang93/openbmclapi/commit/7bc0c86e64aee73f2ad46dd448fa5e73b2773c0d)
- Release 1.10.6 [`303ca97`](https://github.com/bangbang93/openbmclapi/commit/303ca97c21904942c4870988061cff43df9ac550)
- refactor: 不允许直接使用webdav存储 [`1915dcf`](https://github.com/bangbang93/openbmclapi/commit/1915dcfa284eeaefa2ecfbddd814bcdaae2e2048)
- chore: 混入了多余的修改 [`b08f616`](https://github.com/bangbang93/openbmclapi/commit/b08f6164147a7755ac919b2bc9e5204082ba11c5)
- fix(powershell): 将输出改为utf8 [`93a8b57`](https://github.com/bangbang93/openbmclapi/commit/93a8b57260b0f93129f8a6fac04679f12326e600)

#### [v1.10.5](https://github.com/bangbang93/openbmclapi/compare/v1.10.4...v1.10.5)

> 6 May 2024

- Release 1.10.5 [`2834c40`](https://github.com/bangbang93/openbmclapi/commit/2834c405f17590183590b43a7a1261e588a7850d)
- feat: 按需下载加个锁 [`c5850c2`](https://github.com/bangbang93/openbmclapi/commit/c5850c20e88ae38f76f3c5d74e1b912ff295240f)
- chore: armv7的zstd有问题，先把支持掐了 [`5bee6d0`](https://github.com/bangbang93/openbmclapi/commit/5bee6d03189ea6597064eaa70c9f4bc72d7e19d9)
- chore: add armv7 support [`328c2eb`](https://github.com/bangbang93/openbmclapi/commit/328c2eb431a1f1f0ba7843a3290eb05d920921cc)

#### [v1.10.4](https://github.com/bangbang93/openbmclapi/compare/v1.10.3...v1.10.4)

> 26 April 2024

- feat: 使用token rotate [`ad62512`](https://github.com/bangbang93/openbmclapi/commit/ad625123fece214a9d21c70efbd5687eb3fc83c6)
- fix: 当token超时后重新连接ws会使用已过期的token [`d57a159`](https://github.com/bangbang93/openbmclapi/commit/d57a15944451cf34fb9ef3b5b608cc6b6cc9fa6c)
- Release 1.10.4 [`ac2d8de`](https://github.com/bangbang93/openbmclapi/commit/ac2d8de4b6e99ab5b1e0968fa1d51d4a5726904c)
- feat: 调整白名单域名 [`b78095b`](https://github.com/bangbang93/openbmclapi/commit/b78095b5e90ae31d61b1790a79e1502b2213b7ab)
- feat: webdav存储忽略空文件 [`3dcbf38`](https://github.com/bangbang93/openbmclapi/commit/3dcbf38d9c5f4b17b2305a8b80c6cb502a7a0c34)
- fix: 运行中检查文件异常时不要退出 [`5cd2e84`](https://github.com/bangbang93/openbmclapi/commit/5cd2e8496950bdbd802c415d9640259d10bc359e)

#### [v1.10.3](https://github.com/bangbang93/openbmclapi/compare/v1.10.2...v1.10.3)

> 3 April 2024

- refactor: 独立keepalive实现 [`7ff8174`](https://github.com/bangbang93/openbmclapi/commit/7ff81747226c2aa7bcdcef67a6f941106f43a5f4)
- refactor: 调整keep alive写法 [`f713cbd`](https://github.com/bangbang93/openbmclapi/commit/f713cbdb873b760950edc4776ccf8a0157245c84)
- Release 1.10.3 [`793aacc`](https://github.com/bangbang93/openbmclapi/commit/793aaccd4cc338f5d0fbd80855981a2db1a2d083)
- Release 1.10.2-0 [`0614ea5`](https://github.com/bangbang93/openbmclapi/commit/0614ea54c7351b8eb9ba4039e5180048e489d4d5)
- fix: keep alive应当失败三次以上才重新连接 [`4e0147a`](https://github.com/bangbang93/openbmclapi/commit/4e0147a4ee5966998f0ffc54799e7f4fdb23d167)
- fix: 修正被服务器踹下线后重新连接，会开始双心跳 [`aff481c`](https://github.com/bangbang93/openbmclapi/commit/aff481c66ddc1f9a71d5a05f10ad72ea5f48f134)
- feat: 禁用nginx的proxy_buffering [`d3cd3c1`](https://github.com/bangbang93/openbmclapi/commit/d3cd3c1efead9be1fd2d4e401ffc5aee03aa0fb3)
- refactor: 优化日志 [`0e124ee`](https://github.com/bangbang93/openbmclapi/commit/0e124eef3dc4592fbfc20fa59fe2d8ee53f14b1e)

#### [v1.10.2](https://github.com/bangbang93/openbmclapi/compare/v1.10.2-0...v1.10.2)

> 1 April 2024

- Release 1.10.2 [`e119519`](https://github.com/bangbang93/openbmclapi/commit/e119519fb1fef2cc3446c03e07e3aaed06fc024a)
- feat: 同步的请求启用keep alive [`3ab03f6`](https://github.com/bangbang93/openbmclapi/commit/3ab03f679f4ffc836c9063cd8e3ca71a8f1f20eb)
- feat: 适配服务端ws qps限制报错 [`aa6d4df`](https://github.com/bangbang93/openbmclapi/commit/aa6d4dfa3f4417de2129dd5bae038c581651a0a9)

#### [v1.10.2-0](https://github.com/bangbang93/openbmclapi/compare/v1.10.1...v1.10.2-0)

> 28 March 2024

- chore: 优化release构建 [`4e92776`](https://github.com/bangbang93/openbmclapi/commit/4e927769eb5b5ee317c23d2b5c9fcb5e6a75c854)
- Release 1.10.2-0 [`0614ea5`](https://github.com/bangbang93/openbmclapi/commit/0614ea54c7351b8eb9ba4039e5180048e489d4d5)

#### [v1.10.1](https://github.com/bangbang93/openbmclapi/compare/v1.10.0...v1.10.1)

> 28 March 2024

- fix: windows下没有kill用 [`4e2b7bd`](https://github.com/bangbang93/openbmclapi/commit/4e2b7bdca93a8dcddb481ec5961c3525c20d44f2)
- Release 1.10.1 [`23fedf3`](https://github.com/bangbang93/openbmclapi/commit/23fedf30f1c462ca80fc66e7ab7912ff4e68b72f)
- style: fix eslint error [`2899f27`](https://github.com/bangbang93/openbmclapi/commit/2899f275ff878a5c61faddd9830556f12562c21c)
- fix: 检查文件的interval时间忘了改回来了 [`dec6fe5`](https://github.com/bangbang93/openbmclapi/commit/dec6fe5cb38006a28c2b2eee5790e0f51e101421)

#### [v1.10.0](https://github.com/bangbang93/openbmclapi/compare/v1.9.8...v1.10.0)

> 26 March 2024

- chore: setup husky [`9097f2a`](https://github.com/bangbang93/openbmclapi/commit/9097f2a35737b841bfe2e75477cd7e6de0cae7e1)
- feat: upnp [`645c70e`](https://github.com/bangbang93/openbmclapi/commit/645c70e65aa2bf0ed48fd792ea51daf86201086d)
- feat: 文件列表支持增量更新 [`71b20a3`](https://github.com/bangbang93/openbmclapi/commit/71b20a37c9803a97c7cb4530fea19c2eed30f365)
- feat: 打包时带上shell文件 [`fc38e9a`](https://github.com/bangbang93/openbmclapi/commit/fc38e9afae0277f1e57aecfd2ce00bd09816e4a0)
- chore: upgrade @bangbang93/utils [`47768fd`](https://github.com/bangbang93/openbmclapi/commit/47768fd7d0692f8b176f3b78dfccee67c94ee827)
- Release 1.10.0 [`8d7b87d`](https://github.com/bangbang93/openbmclapi/commit/8d7b87dcfb86152688245b082c9d4ef10fcf9868)
- fix: 修正被主控踹下线时重连异常 [`100c628`](https://github.com/bangbang93/openbmclapi/commit/100c6280ae45fe3d5b438fea9573810f750ac1a7)
- docs: upnp [`2d492d3`](https://github.com/bangbang93/openbmclapi/commit/2d492d30a59c74df489e474d268c0e996f39e58f)
- feat: upnp给个描述 [`f563e33`](https://github.com/bangbang93/openbmclapi/commit/f563e3382ff967eb3cf24d0de1b6dfcd01440c50)

#### [v1.9.8](https://github.com/bangbang93/openbmclapi/compare/v1.9.7...v1.9.8)

> 14 March 2024

- chore: 升级eslint [`a69a2f4`](https://github.com/bangbang93/openbmclapi/commit/a69a2f4786f330daedf1c76d1521f68e8f1883e7)
- feat: 更换进度条实现 [`6a2b774`](https://github.com/bangbang93/openbmclapi/commit/6a2b77456a16009804412d19b731495e558431b8)
- feat: 进度条改为文件进度 [`945d398`](https://github.com/bangbang93/openbmclapi/commit/945d398686419a0e8fcaa22d81bf771a8759795c)
- feat: 改用socket.io本身的timeout处理enable超时 [`ec72efd`](https://github.com/bangbang93/openbmclapi/commit/ec72efde420d7637ff1fad5fbb22f94bb666de31)
- Release 1.9.8 [`e5e1ed0`](https://github.com/bangbang93/openbmclapi/commit/e5e1ed088c2ba6e915f156b5a4fa4b77e478ab9f)
- feat: 发送节点flavor [`b4e532e`](https://github.com/bangbang93/openbmclapi/commit/b4e532e3a687ab09c6f5ba87575ea5d13c4eb4b3)
- feat: 文件校验失败时记录一下重定向 [`7b0107a`](https://github.com/bangbang93/openbmclapi/commit/7b0107a239ed35fbc3708907c7be1ba07fb3c2d2)
- docs: 优化文档 [`8cfaf3b`](https://github.com/bangbang93/openbmclapi/commit/8cfaf3b64a0a142fe85a4af166e3f84fda8d8db2)
- feat: 限制一下连接时间 [`d12f2f3`](https://github.com/bangbang93/openbmclapi/commit/d12f2f3e32128e5049b5100062402c532a53f4a0)
- feat: 删除文件给个顺序 [`fe22751`](https://github.com/bangbang93/openbmclapi/commit/fe22751eddb0d5b123732be5eab5537072fa4541)

#### [v1.9.7](https://github.com/bangbang93/openbmclapi/compare/v1.9.6...v1.9.7)

> 2 March 2024

- Release 1.9.7 [`c40750b`](https://github.com/bangbang93/openbmclapi/commit/c40750bd4749205c1caf3187f1ece39c095cca10)
- fix: 构建时检查docker起来了没 [`57efe34`](https://github.com/bangbang93/openbmclapi/commit/57efe3422969ebac4fd689e9b4e8e77afb76d867)
- fix: 修正file storage文件校验 [`003c06f`](https://github.com/bangbang93/openbmclapi/commit/003c06f1ee1ee2c3e562593ccf0324a528f1bc9f)
- feat: 当版本包含-时，视为prerelease [`ca4369a`](https://github.com/bangbang93/openbmclapi/commit/ca4369a6d36b23e102ad9c391b3bf6d8badfea57)

#### [v1.9.6](https://github.com/bangbang93/openbmclapi/compare/v1.9.5...v1.9.6)

> 1 March 2024

- Release 1.9.6 [`58c17a5`](https://github.com/bangbang93/openbmclapi/commit/58c17a51fb60b3846e7a577841a85192ded4c082)
- chore: 修正脑残 [`b8ac619`](https://github.com/bangbang93/openbmclapi/commit/b8ac619d81f35de8cf4b601130de4ee206fe422f)

#### [v1.9.5](https://github.com/bangbang93/openbmclapi/compare/v1.9.4...v1.9.5)

> 1 March 2024

- Release 1.9.5 [`f53abe2`](https://github.com/bangbang93/openbmclapi/commit/f53abe29b93e796722a612ab380b9efb13179346)
- chore: 修正windows打包 [`7ec4eaa`](https://github.com/bangbang93/openbmclapi/commit/7ec4eaa3b4e4253771614be76d0c54bff87e05b9)

#### [v1.9.4](https://github.com/bangbang93/openbmclapi/compare/v1.9.3...v1.9.4)

> 1 March 2024

- fix: Standardized-Yaml-usage [`#49`](https://github.com/bangbang93/openbmclapi/pull/49)
- Bump node-fetch from 2.6.6 to 2.6.7 [`#19`](https://github.com/bangbang93/openbmclapi/pull/19)
- Bump simple-get from 3.1.0 to 3.1.1 [`#20`](https://github.com/bangbang93/openbmclapi/pull/20)
- chore(deps): bump the npm_and_yarn group group with 2 updates [`#56`](https://github.com/bangbang93/openbmclapi/pull/56)
- chore: 升级eslint [`47ebe43`](https://github.com/bangbang93/openbmclapi/commit/47ebe43658922c5a333194cec310ffca7359eb8f)
- fix: 修正got升级带来的类型变化 [`8115df3`](https://github.com/bangbang93/openbmclapi/commit/8115df3113d56d0dccb69fec5bf196a5650f570a)
- feat: 升级TypeScript [`4e54b34`](https://github.com/bangbang93/openbmclapi/commit/4e54b34bf6669cc41edaa38525802428cc91637a)
- feat: file storage 校验文件时也校验文件大小 [`f7079cd`](https://github.com/bangbang93/openbmclapi/commit/f7079cd1e4574bcf92c7d1540ac1b07e99c074b5)
- Release 1.9.4 [`079c24c`](https://github.com/bangbang93/openbmclapi/commit/079c24c9c75a48f6c1570e3e190b4d9361d060f9)
- docs: 文档加入项目说明 [`261074a`](https://github.com/bangbang93/openbmclapi/commit/261074a2e436a10132d86bf1195d9f738bb269c9)
- feat: webdav校验文件时也校验文件大小 [`b836839`](https://github.com/bangbang93/openbmclapi/commit/b8368398ad20cde0c4b5651af0be46899bdd687e)
- fix: connect是异步方法了 [`f63fd1b`](https://github.com/bangbang93/openbmclapi/commit/f63fd1bc5687380b15090843e8a85f92bf586335)
- feat: 仅在启动时检查文件gc [`57a9644`](https://github.com/bangbang93/openbmclapi/commit/57a96440d33e20072fb6b0d152cd95e39ae8f639)
- docs: docker部署指北 [`b593f85`](https://github.com/bangbang93/openbmclapi/commit/b593f85359e0077ef8aa1211f14747d6d55705e9)
- docs: 修正文档中的node版本 [`28a4391`](https://github.com/bangbang93/openbmclapi/commit/28a439126275e6bc80152d991d76bfabd58c195c)
- fix: powershell的变量也是$ [`3feaa96`](https://github.com/bangbang93/openbmclapi/commit/3feaa968cc7c74fac9f7621a5db26d9103a0d043)
- fix: Standardized Yaml usage [`c7ff93a`](https://github.com/bangbang93/openbmclapi/commit/c7ff93a9515ca324ed9125f5da18a99763815997)

#### [v1.9.3](https://github.com/bangbang93/openbmclapi/compare/v1.9.2...v1.9.3)

> 23 February 2024

- Release 1.9.3 [`0284008`](https://github.com/bangbang93/openbmclapi/commit/028400872bd14ea821223fc7d4264141c065dc5e)
- feat: 把node的二进制打进tar包里 [`ec16a88`](https://github.com/bangbang93/openbmclapi/commit/ec16a88bcde54fd4dedfffe372652ad4e63f00c2)
- fix: 修正从网盘节点同步时会400 [`53b5d39`](https://github.com/bangbang93/openbmclapi/commit/53b5d3928144764f477769b3f75a31a9304814e7)
- feat: 下载错误时给个redirectUrls [`1939038`](https://github.com/bangbang93/openbmclapi/commit/1939038e6af7152ee110d868bda7d77a6cd878e4)
- docs: 修改文件挂载 [`6cb8a20`](https://github.com/bangbang93/openbmclapi/commit/6cb8a20437898bb92b7af15913d71daf6f2ca733)
- feat: 下载错误时给个body [`3d7420e`](https://github.com/bangbang93/openbmclapi/commit/3d7420e9cc655c03a84fac0475911409d8f5302f)

#### [v1.9.2](https://github.com/bangbang93/openbmclapi/compare/v1.9.1...v1.9.2)

> 23 February 2024

- feat: measure改为签名校验 [`#54`](https://github.com/bangbang93/openbmclapi/pull/54)
- Release 1.9.2 [`0ce2236`](https://github.com/bangbang93/openbmclapi/commit/0ce22361872018b5135ae33f5c380031e79fee67)
- feat: 下载失败的时候给个详细的url [`2a549c7`](https://github.com/bangbang93/openbmclapi/commit/2a549c7b7cf7a8ca5369cd1d743dd9db3196641b)
- feat: 增加一台rsync服务器 [`c898e24`](https://github.com/bangbang93/openbmclapi/commit/c898e2405b63fc6974b97c582effac9477577d68)
- feat: 修正noopen参数 [`d261127`](https://github.com/bangbang93/openbmclapi/commit/d26112793ff7e31f143e8aad5c5643cc8a3ec246)

#### [v1.9.1](https://github.com/bangbang93/openbmclapi/compare/v1.9.0...v1.9.1)

> 21 February 2024

- Release 1.9.1 [`cc0f27d`](https://github.com/bangbang93/openbmclapi/commit/cc0f27d664ec5eb5002627d07aeb93d23e8ca300)
- fix: 请求证书前等待ws连接 [`03fd43d`](https://github.com/bangbang93/openbmclapi/commit/03fd43d952fd1a40397aed11e443eb7ed2300992)

#### [v1.9.0](https://github.com/bangbang93/openbmclapi/compare/v1.8.2...v1.9.0)

> 21 February 2024

- feat: 使用token校验，避免在网络中传输secret [`#48`](https://github.com/bangbang93/openbmclapi/pull/48)
- Release 1.8.2 [`5d95ebe`](https://github.com/bangbang93/openbmclapi/commit/5d95ebec76b95615aafbd1952b3881d8db523361)
- Release 1.9.0 [`aeaf935`](https://github.com/bangbang93/openbmclapi/commit/aeaf9359ce94628f5a5db54424f80390a6e1d5b8)
- docs: readme 指向wiki [`b5d2da4`](https://github.com/bangbang93/openbmclapi/commit/b5d2da402363fef4d89f99a1a89ba63b26a761e1)
- feat: windows的tar没有xz [`6e26fb0`](https://github.com/bangbang93/openbmclapi/commit/6e26fb05741a8fa5d430476f687b7f70cc28daec)

#### [v1.8.2](https://github.com/bangbang93/openbmclapi/compare/v1.8.1...v1.8.2)

> 20 February 2024

- doc: update readme [`#44`](https://github.com/bangbang93/openbmclapi/pull/44)
- docs: 调整rsync命令 [`#42`](https://github.com/bangbang93/openbmclapi/issues/42)
- chore: build改为rimraf，兼容一下windows [`585fb20`](https://github.com/bangbang93/openbmclapi/commit/585fb20dc12787e2bb4afb613a54e12ef69863e4)
- fix: 使用webdav和alist时，实时同步文件没有更新文件列表，导致会一直重复同步相同的文件 [`da311c1`](https://github.com/bangbang93/openbmclapi/commit/da311c11cc1298391e6a6fa8edd68672ab493701)
- feat: 单个文件出错时不要停止同步 [`c2c63ab`](https://github.com/bangbang93/openbmclapi/commit/c2c63abbeadde39e31d38ed4b6b18f3ed79b8bae)
- chore: 构建release不要fail-fast [`901e83c`](https://github.com/bangbang93/openbmclapi/commit/901e83c90264a6435e7a20d84c2e99cb3bca61b4)
- feat: 进程退出时给个exitcode [`f08fd66`](https://github.com/bangbang93/openbmclapi/commit/f08fd66f998487a33ff727b82329727517e8cc4c)
- chore: 定一下时区，避免签名校验问题 [`bfdd9f7`](https://github.com/bangbang93/openbmclapi/commit/bfdd9f777700ccccef8ac754f849b436ba37caf7)
- feat: build arm64 image [`057186a`](https://github.com/bangbang93/openbmclapi/commit/057186a82f57860bc1eaf57604f925561c264893)
- feat: 延长单文件下载超时时间 [`88796c2`](https://github.com/bangbang93/openbmclapi/commit/88796c245e9331c7689ca34ac9544df7624c4bf7)
- fix: 修正跨系统的tarball [`0e66014`](https://github.com/bangbang93/openbmclapi/commit/0e6601422266de1dc43cc940b4dd26a062652b92)
- fix: 修正手癌 [`f1edf16`](https://github.com/bangbang93/openbmclapi/commit/f1edf169b4afca94c8675711876abae567be4a51)
- doc: Added configuration parameters before startup [`634d94c`](https://github.com/bangbang93/openbmclapi/commit/634d94c6c327bce1acaba9458598267b41580734)
- feat: tag也要打arm64的 [`5a05413`](https://github.com/bangbang93/openbmclapi/commit/5a054136f78ce7202402175b5d2fb6d448f405d4)

#### [v1.8.1](https://github.com/bangbang93/openbmclapi/compare/v1.8.0...v1.8.1)

> 8 February 2024

- Release 1.8.1 [`434dea3`](https://github.com/bangbang93/openbmclapi/commit/434dea35fd664860fddb3597f47d75be192fea6a)
- fix: 修正nginx的ssl证书路径错误 [`87fa381`](https://github.com/bangbang93/openbmclapi/commit/87fa3815d09cc14901201d3c46952bfd185f690c)
- fix: disable access log [`773ae17`](https://github.com/bangbang93/openbmclapi/commit/773ae170c488bca01d5ba1d43854d8fcd0c16ebf)

#### [v1.8.0](https://github.com/bangbang93/openbmclapi/compare/v1.7.3...v1.8.0)

> 7 February 2024

- feat: alist webdav可以用了 [`ee448ce`](https://github.com/bangbang93/openbmclapi/commit/ee448cef4fac9645231465dd22a60af964ca6371)
- feat: init pino [`bf8a438`](https://github.com/bangbang93/openbmclapi/commit/bf8a4386d11d99886c57c3548bdf4bb0e8560ea6)
- feat: init prettier [`75e7080`](https://github.com/bangbang93/openbmclapi/commit/75e7080235f273daaace08561aec979ccddcbbed)
- feat: 打印一下同步策略 [`7e4100a`](https://github.com/bangbang93/openbmclapi/commit/7e4100a125384850bb085fbf3932deadd9f0e27b)
- feat: 抽象存储实现 [`e5f8333`](https://github.com/bangbang93/openbmclapi/commit/e5f8333e002e340dc94a016484bb01f7eecf8da0)
- feat: 支持alist webdav [`1fc121a`](https://github.com/bangbang93/openbmclapi/commit/1fc121a0338e70e8e8ac0cb6601b29fd340353fc)
- feat: 整个配置类，不要遍地env了 [`0dc9b60`](https://github.com/bangbang93/openbmclapi/commit/0dc9b602087643493506c9326334b14745458472)
- feat: 统计流量 [`60617ab`](https://github.com/bangbang93/openbmclapi/commit/60617ab240710678f73df5e944cf7f2ae318c9c9)
- feat: 从服务端获取一部分设置 [`dca05b6`](https://github.com/bangbang93/openbmclapi/commit/dca05b6fa09d4ac9723bb41cb88ff8c9bbccf49b)
- feat: 完善webdav存储 [`d6a7c98`](https://github.com/bangbang93/openbmclapi/commit/d6a7c98d80b53cd83c451baf0e1ce12e231cb171)
- feat: keep alive日志打印一下文件和流量 [`35fd21c`](https://github.com/bangbang93/openbmclapi/commit/35fd21c9616b7812f4ed4e082677ef985e853f35)
- Release 1.8.0 [`1e7c568`](https://github.com/bangbang93/openbmclapi/commit/1e7c568a0eaa705f95ee11d71e04769278311e41)
- chore: 换一个action创建release，带changelog [`043ce9a`](https://github.com/bangbang93/openbmclapi/commit/043ce9a05f284701d98f4ca0e79eebcc42e9f4c5)
- chore: 统一基础镜像 [`394c435`](https://github.com/bangbang93/openbmclapi/commit/394c43509ba38db60a6254155d8589656ec3eeec)
- feat: 恢复FORCE_NOOPEN参数 [`90f81f4`](https://github.com/bangbang93/openbmclapi/commit/90f81f4eb29c4cf13cf47654d4e8313cfe52b8b8)
- fix: 修正size计算 [`f1221c5`](https://github.com/bangbang93/openbmclapi/commit/f1221c56141dff7924450b352fb48cb296f8095d)
- chore: master构建为next，latest与tag保持一致 [`fa0f163`](https://github.com/bangbang93/openbmclapi/commit/fa0f163d37b7f941d9d1aaf32bfff72164599f0a)
- docs: 不要tsx了，老老实实编译吧 [`e9bb04f`](https://github.com/bangbang93/openbmclapi/commit/e9bb04f1af1c17669588a0afe0107f029fc513aa)
- docs: 添加一台rsync服务器 [`e932ae7`](https://github.com/bangbang93/openbmclapi/commit/e932ae78f023c6a33c7e0d0a6b1b14d29ae6cf23)
- docs: 修改rsync同步命令 [`c8080ec`](https://github.com/bangbang93/openbmclapi/commit/c8080ec193f3dff0b3eb5365a62560868c1f7256)
- fix: 修正byoc的协议 [`24be61d`](https://github.com/bangbang93/openbmclapi/commit/24be61db3acb2a8e0655960f1789b33b34d00f2b)
- fix: nginx conf sock地址有问题 [`44988eb`](https://github.com/bangbang93/openbmclapi/commit/44988ebdd671e11ec2245a1a9322208ede92db4e)
- feat: 每分钟保存一次状态就可以了 [`84bcd04`](https://github.com/bangbang93/openbmclapi/commit/84bcd04d54d1eadfab18bd2fd3db4102f57b38ba)

#### [v1.7.3](https://github.com/bangbang93/openbmclapi/compare/v1.7.2...v1.7.3)

> 3 February 2024

- feat: 优化快速重新连接 [`25410e5`](https://github.com/bangbang93/openbmclapi/commit/25410e5acb277c3050b15d1a0a00adbf1095fdae)
- fix: 修正release发布 [`9e36958`](https://github.com/bangbang93/openbmclapi/commit/9e369589dbb8ef46ce4b059dbed0e69e7645e8f1)
- Release 1.7.3 [`908a8d1`](https://github.com/bangbang93/openbmclapi/commit/908a8d15f571052ab983e676f3dbcabbfa63b7a8)
- feat: 配合服务端进行重新连接后快速上线 [`bcfdd09`](https://github.com/bangbang93/openbmclapi/commit/bcfdd09d2e2a89d2daa1c6dabcc0e609f3c7016c)

#### [v1.7.2](https://github.com/bangbang93/openbmclapi/compare/v1.7.1...v1.7.2)

> 2 February 2024

- chore: 改用buildx构建 [`735278c`](https://github.com/bangbang93/openbmclapi/commit/735278ceba611da19ed0c4a4c0a76a87cb5bf916)
- feat: 调整sock文件位置 [`60c2451`](https://github.com/bangbang93/openbmclapi/commit/60c2451910564dea6a48e21ceed3e13b49ecb0fd)
- feat: release 至少可以整个tar [`eef12a6`](https://github.com/bangbang93/openbmclapi/commit/eef12a6a6b7145e1e6e74acf9ea6956be46af863)
- Release 1.7.2 [`3bb57d8`](https://github.com/bangbang93/openbmclapi/commit/3bb57d884d833d9f6edc706b8829f509c1c6baa3)
- fix: 修正快速重启 [`2d2cbf4`](https://github.com/bangbang93/openbmclapi/commit/2d2cbf43084c0156f16d624a2ceb182ba422b257)
- chore: release给个cache [`01043db`](https://github.com/bangbang93/openbmclapi/commit/01043dbd2af12149bc4e4f033593f55007eb841a)
- feat: sock不在cache目录里了，gc的时候可以不用管它了 [`d9385c5`](https://github.com/bangbang93/openbmclapi/commit/d9385c5c929ad789dbc58811df4e89dfe9e74d7e)
- chore: fix typo [`1bde642`](https://github.com/bangbang93/openbmclapi/commit/1bde64237cb2ee31074d1f6fd29b7cf0d9efd83d)
- docs: ts-node不支持ts5，换成tsx [`5db2ec7`](https://github.com/bangbang93/openbmclapi/commit/5db2ec7dcaf423c11b1c1f75ebc468318a84a1ec)

#### [v1.7.1](https://github.com/bangbang93/openbmclapi/compare/v1.7.0...v1.7.1)

> 30 January 2024

- feat: 启用nginx时支持校验签名 [`70866b6`](https://github.com/bangbang93/openbmclapi/commit/70866b6bcfe0e4c813eb2eb378898214ee8bebcd)
- Release 1.7.1 [`3e4a23b`](https://github.com/bangbang93/openbmclapi/commit/3e4a23b6355ee0d85d53d3e87092d5ca53617062)

#### [v1.7.0](https://github.com/bangbang93/openbmclapi/compare/v1.6.11...v1.7.0)

> 30 January 2024

- feat: 检验请求签名 [`fff774d`](https://github.com/bangbang93/openbmclapi/commit/fff774daf9566936f54703cb04216f729ace4a87)
- chore: 创建空release [`df69b4a`](https://github.com/bangbang93/openbmclapi/commit/df69b4a48cd9c1e9fb03c6b6c7eef99d7201379a)
- Release 1.7.0 [`86afb00`](https://github.com/bangbang93/openbmclapi/commit/86afb003539f6a5759e07ccc54f802eda5aaac9f)
- fix: 带宽测量没有结束请求 [`91e2fc8`](https://github.com/bangbang93/openbmclapi/commit/91e2fc80fb4d8dcee9a7cdff25684315d51cb825)

#### [v1.6.11](https://github.com/bangbang93/openbmclapi/compare/v1.6.10...v1.6.11)

> 26 January 2024

- chore: 优化gitlab构建 [`9fdefa0`](https://github.com/bangbang93/openbmclapi/commit/9fdefa021a3bcb52220b948abd6e27117d87117c)
- chore: 主动推送mirror [`173b7cc`](https://github.com/bangbang93/openbmclapi/commit/173b7cc57dd80d3060826279d48c5b0b5451aae9)
- feat: 逐步替换bluebird [`6e59920`](https://github.com/bangbang93/openbmclapi/commit/6e5992089f18bdf7ced5efb44349961873fe2722)
- Release 1.6.11 [`03d2f5f`](https://github.com/bangbang93/openbmclapi/commit/03d2f5fcbab3313cb06db667d034fe3cb3390ca3)
- docs: 参数说明 [`cf7bda9`](https://github.com/bangbang93/openbmclapi/commit/cf7bda9bf687a55c8455acb067342c6af70e94ad)
- feat: 速度限制的说明 [`1f21a9b`](https://github.com/bangbang93/openbmclapi/commit/1f21a9b3ed9e8609779763d8e1eeac99b986ecb0)
- feat: 加入多线程下载 [`94e952d`](https://github.com/bangbang93/openbmclapi/commit/94e952df58fa16ad3da21d27d274f2c33fc5edb5)
- chore: 临时禁用release [`c86594e`](https://github.com/bangbang93/openbmclapi/commit/c86594e8c3fdcd0483eca40e5d9eb157d1e5e4cb)
- docs: trickle不适用于nodejs [`ce3db60`](https://github.com/bangbang93/openbmclapi/commit/ce3db60014d017e2406d85f0c4d99ef2f8c0d94e)
- feat: 优化流量计算 [`d968d1d`](https://github.com/bangbang93/openbmclapi/commit/d968d1de85c098e2b67ef71080a6e14e6600b127)
- feat: 下载给个retry [`4500f08`](https://github.com/bangbang93/openbmclapi/commit/4500f08d16c175a901b3f8ede34bba52c849ab47)
- chore: 更新gitlab使用的docker版本 [`372450c`](https://github.com/bangbang93/openbmclapi/commit/372450c6907069e66b0263a14d4172a0bb78b16e)
- feat: 非tty给个进度 [`5a3cc3c`](https://github.com/bangbang93/openbmclapi/commit/5a3cc3c761b795689ddcfe971067ae49e500cfbb)
- feat: 启用nginx的ssl session [`daac311`](https://github.com/bangbang93/openbmclapi/commit/daac31159624ccbd54b419ce3bd4ec71c3d05935)
- chore: 忘了GitLab registry还要登录了 [`d6d5754`](https://github.com/bangbang93/openbmclapi/commit/d6d5754c5ca6d08e0a14d29081a234dcd3ec2351)
- fix: disable时禁用keep-alive [`018645b`](https://github.com/bangbang93/openbmclapi/commit/018645b3f642f7e2d3067ca08ffe5656ad568e87)
- feat: trickle并没有什么卯月，掐了吧 [`efd2731`](https://github.com/bangbang93/openbmclapi/commit/efd27317cb47b9c51ab617b91b35c802812dbea2)
- docs: 速度限制的说明 [`ebc5f56`](https://github.com/bangbang93/openbmclapi/commit/ebc5f56f3c3537365c12cdb841a514c6328b35df)
- fix: 避免出现无法解析的size，从而导致bytes成为NaN [`37a815f`](https://github.com/bangbang93/openbmclapi/commit/37a815ff9f696f4b2d06593f3595e24cc4bedbde)
- feat: 延长restart超时时间 [`8db53c0`](https://github.com/bangbang93/openbmclapi/commit/8db53c076a3dd93db8d59b87c42e2e0d13ce1bf6)
- feat: 开始同步前给个文件数总计 [`a032f97`](https://github.com/bangbang93/openbmclapi/commit/a032f976e7952f0111201ec2a91fd557d6bc0d21)

#### [v1.6.10](https://github.com/bangbang93/openbmclapi/compare/v1.6.9...v1.6.10)

> 23 January 2024

- Release 1.6.10 [`f3bb208`](https://github.com/bangbang93/openbmclapi/commit/f3bb20844316e5b833c07d6fb3446de6c041db6a)
- feat: 允许强制从center server同步 [`a613844`](https://github.com/bangbang93/openbmclapi/commit/a613844658427d474eb88cbb820e406164986a5b)
- fix: backoff时间取错了 [`550949f`](https://github.com/bangbang93/openbmclapi/commit/550949f72a674c1a7befe96f8c297830f0e9beb4)

#### [v1.6.9](https://github.com/bangbang93/openbmclapi/compare/v1.6.8...v1.6.9)

> 11 January 2024

- Release 1.6.9 [`cd0e0d6`](https://github.com/bangbang93/openbmclapi/commit/cd0e0d6e4d4769ac66e0fc83d6ab9d3487509cc0)
- feat: 调整node版本 [`c12df7c`](https://github.com/bangbang93/openbmclapi/commit/c12df7c508eb24c890fbe77bc903b36b806bc04e)

#### [v1.6.8](https://github.com/bangbang93/openbmclapi/compare/v1.6.7...v1.6.8)

> 11 January 2024

- chore(deps-dev): bump word-wrap from 1.2.3 to 1.2.4 [`#32`](https://github.com/bangbang93/openbmclapi/pull/32)
- feat: 更换解压缩方法 [`eae6807`](https://github.com/bangbang93/openbmclapi/commit/eae6807dd6978e585628081453438afa11345ca5)
- fix: pkg打包 [`886fb17`](https://github.com/bangbang93/openbmclapi/commit/886fb17cf1e0f4393fcb54f44af9cb2e7e1179ad)
- Release 1.6.8 [`dac4795`](https://github.com/bangbang93/openbmclapi/commit/dac47959da58fc2fd3779248058d35646a0aef7c)
- feat: 动态backoff [`7890db9`](https://github.com/bangbang93/openbmclapi/commit/7890db9a177c118a95e39d03382d30919808d8ec)
- chore(ci): 给点retry [`b49b552`](https://github.com/bangbang93/openbmclapi/commit/b49b552dfb2d9781015ff7067ba1757c6fd55dc7)

#### [v1.6.7](https://github.com/bangbang93/openbmclapi/compare/v1.6.6...v1.6.7)

> 9 June 2023

- Release 1.6.7 [`d91d975`](https://github.com/bangbang93/openbmclapi/commit/d91d975506bd7166863489b12970b4936a9fcbd5)
- fix: require [`59ca64f`](https://github.com/bangbang93/openbmclapi/commit/59ca64fe3bc92c58485b7a4a97b1a3eee053a1d2)
- fix: dirname [`d956032`](https://github.com/bangbang93/openbmclapi/commit/d956032eac6a2891143864f2c360b54e92a59f88)
- fix: nginx config path [`6b4b07d`](https://github.com/bangbang93/openbmclapi/commit/6b4b07d78e1a3bf4a0329d01eea9e3757d958dc1)
- fix: nginx root [`be888ab`](https://github.com/bangbang93/openbmclapi/commit/be888abc5d410fd1cd31c8d9a5127cc8f82fd7e8)
- fix: nginx日志换行 [`881d61f`](https://github.com/bangbang93/openbmclapi/commit/881d61ffe579650ee57aebb0d9149ab09939f1cf)

#### [v1.6.6](https://github.com/bangbang93/openbmclapi/compare/v1.6.5...v1.6.6)

> 9 June 2023

- Release 1.6.6 [`02041d4`](https://github.com/bangbang93/openbmclapi/commit/02041d4086168989bc9ad27c2600e378cfec8968)
- fix: dirname [`81a8698`](https://github.com/bangbang93/openbmclapi/commit/81a869879bb1d3fc02cf97e1e101a0ab559f512b)

#### [v1.6.5](https://github.com/bangbang93/openbmclapi/compare/v1.6.4...v1.6.5)

> 9 June 2023

- fix: 优化校验 [`16d293e`](https://github.com/bangbang93/openbmclapi/commit/16d293e420502f3dd97bbbadf469f2b1318d0b4b)
- Release 1.6.5 [`5fc804b`](https://github.com/bangbang93/openbmclapi/commit/5fc804be935e5f110e75676c1435017b5755727c)
- fix: import [`4e935e3`](https://github.com/bangbang93/openbmclapi/commit/4e935e300bf8a1e37041a6a2cdb5443cbc2c0dd1)

#### [v1.6.4](https://github.com/bangbang93/openbmclapi/compare/v1.6.3...v1.6.4)

> 9 June 2023

- fix: esm startup [`b4bd2bf`](https://github.com/bangbang93/openbmclapi/commit/b4bd2bf0e8f913db27d616a8b0959caf1aba83dc)
- Release 1.6.4 [`7d43cc1`](https://github.com/bangbang93/openbmclapi/commit/7d43cc1564264eea68956907614b042829bbe0ad)

#### [v1.6.3](https://github.com/bangbang93/openbmclapi/compare/v1.6.2...v1.6.3)

> 8 June 2023

- Release 1.6.3 [`aa52fdb`](https://github.com/bangbang93/openbmclapi/commit/aa52fdb0fd3859c370d57a424fe2f18e0d603adc)
- fix: type=module [`eba274d`](https://github.com/bangbang93/openbmclapi/commit/eba274dffb120a57f6521a8b023758719f0abef7)

#### [v1.6.2](https://github.com/bangbang93/openbmclapi/compare/v1.6.1...v1.6.2)

> 8 June 2023

- Bump socket.io-parser from 4.2.1 to 4.2.3 [`#31`](https://github.com/bangbang93/openbmclapi/pull/31)
- Bump socket.io-parser from 4.2.0 to 4.2.1 [`#28`](https://github.com/bangbang93/openbmclapi/pull/28)
- Bump http-cache-semantics from 4.1.0 to 4.1.1 [`#29`](https://github.com/bangbang93/openbmclapi/pull/29)
- chore: esm [`a936f52`](https://github.com/bangbang93/openbmclapi/commit/a936f520d1f46929e614fc68529c9cf78dc9c5c6)
- style: 调整eslint规则 [`f72fe6b`](https://github.com/bangbang93/openbmclapi/commit/f72fe6b8acb776450aa899371ba2d7b60a50ad1a)
- chore: 更换tail实现 [`e4bb2e3`](https://github.com/bangbang93/openbmclapi/commit/e4bb2e3ff92306d0626cfc9ccf56884e7d77639f)
- chore: 优化类型和依赖 [`3703b72`](https://github.com/bangbang93/openbmclapi/commit/3703b72d75883217e7236421f46f423e3fe0cae1)
- Release 1.6.2 [`e888e8f`](https://github.com/bangbang93/openbmclapi/commit/e888e8fd161a3b082a768a620211f0fb3233b269)
- chore: fix docker build [`0e6a0d8`](https://github.com/bangbang93/openbmclapi/commit/0e6a0d8d97e653fa3a7fdd688fd6a09a3b3a8e60)
- chore: 主build还是留给tsc [`9867692`](https://github.com/bangbang93/openbmclapi/commit/98676924b1ab17d0092883398499e18273967c06)
- chore: 统一LICENSE [`0cac52a`](https://github.com/bangbang93/openbmclapi/commit/0cac52ae9eb200bea4c0edae5ce85df03d93c125)

#### [v1.6.1](https://github.com/bangbang93/openbmclapi/compare/v1.6.0...v1.6.1)

> 22 March 2023

- chore: 升级eslint [`01a5e90`](https://github.com/bangbang93/openbmclapi/commit/01a5e9064c99cf877f79d5970c57a2973e7309c2)
- chore: 更换zstd实现 [`2efd7b3`](https://github.com/bangbang93/openbmclapi/commit/2efd7b308eb54373ee67a005cda5fcc2b8be9a93)
- feat: 下载失败时给个log [`5325b3a`](https://github.com/bangbang93/openbmclapi/commit/5325b3ab8151089220402d818798724ee539428b)
- fix: 检查文件出错时不要导致进程崩溃 [`9640bee`](https://github.com/bangbang93/openbmclapi/commit/9640beedbd9ae1cdd2d1a3126edd2b3f227aacdc)
- Release 1.6.1 [`fc3f6cc`](https://github.com/bangbang93/openbmclapi/commit/fc3f6ccc080072aa282e95e43009ae9277475479)
- feat: add tini [`4282721`](https://github.com/bangbang93/openbmclapi/commit/4282721669e774b741661dd694c07da12abcae78)
- Revert "feat: 修改zstd解压方式" [`c387b8c`](https://github.com/bangbang93/openbmclapi/commit/c387b8c968693d3c5418625c1a91707a01bf4080)
- feat: 修改zstd解压方式 [`488dccb`](https://github.com/bangbang93/openbmclapi/commit/488dccb5769dad3334b8241bf97a8fd12c995c38)

#### [v1.6.0](https://github.com/bangbang93/openbmclapi/compare/v1.5.1...v1.6.0)

> 21 December 2022

- Bump got from 10.7.0 to 11.8.5 [`#22`](https://github.com/bangbang93/openbmclapi/pull/22)
- chore: 升级到node18 [`8f316d3`](https://github.com/bangbang93/openbmclapi/commit/8f316d31c203fbdf35e1f2a94fbcc923d87f80e5)
- refactor: 统一nginx配置 [`4f466fb`](https://github.com/bangbang93/openbmclapi/commit/4f466fbf6f40099442e5ef61bbcc87ef0024a7f3)
- feat: 当使用nginx时，node进程监听unix sock [`ddcb9e5`](https://github.com/bangbang93/openbmclapi/commit/ddcb9e53d7fe4152ebe207dcef5fbd0968e1372c)
- chore: 优化import，使用node 18内置的source map support [`68dd4e1`](https://github.com/bangbang93/openbmclapi/commit/68dd4e12764e4a97a57216a6a45ffe5c91c715b8)
- feat: 下载时校验文件hash，所以可以从openbmclapi其他节点拉取文件了 [`eda01d0`](https://github.com/bangbang93/openbmclapi/commit/eda01d0087685e61618aca3ad62354cba5f62d04)
- Release 1.6.0 [`228a71b`](https://github.com/bangbang93/openbmclapi/commit/228a71b3cf16ddb90eb8d47e144dc5d7bca1de23)
- fix: 清理过期文件的时候不要把sock删了 [`9d712fd`](https://github.com/bangbang93/openbmclapi/commit/9d712fdb82f9d8d57b5f907a8161992a52346173)
- fix: 修正nginx配置 [`91891d8`](https://github.com/bangbang93/openbmclapi/commit/91891d854bfdb6f9614469468af707e5adf6b57c)
- fix: Dockerfile cmd [`f73d5e1`](https://github.com/bangbang93/openbmclapi/commit/f73d5e1b13952916d4819ea0b4a7c6f1dc81aadd)

#### [v1.5.1](https://github.com/bangbang93/openbmclapi/compare/v1.5.0...v1.5.1)

> 10 August 2022

- zstd换个wasm的库，方便兼容Windows [`6d3b698`](https://github.com/bangbang93/openbmclapi/commit/6d3b698e0d42a66f60e6ed98ff32c821d641503d)
- Release 1.5.1 [`06b41ab`](https://github.com/bangbang93/openbmclapi/commit/06b41ab7ba7e9362d4c07dcb0bce40af341a23c6)

#### [v1.5.0](https://github.com/bangbang93/openbmclapi/compare/v1.4.4...v1.5.0)

> 5 August 2022

- 文件列表使用avsc+zstd做压缩 [`4fe4630`](https://github.com/bangbang93/openbmclapi/commit/4fe46302525ec872ccb08ef113d3ba537b446337)
- 固定pkg打包版本 [`363aa1f`](https://github.com/bangbang93/openbmclapi/commit/363aa1f37bfa1c4d066ab2ef2defa5f4de9caaac)
- apt-get update [`fdbfc89`](https://github.com/bangbang93/openbmclapi/commit/fdbfc89e54debe4f987fa4d57ea5d4f939700fdd)
- 换了Debian了 [`758d641`](https://github.com/bangbang93/openbmclapi/commit/758d641f6eb8bccbf2791be839ef44bf95a4dc3d)
- 得把二进制打进去 [`703e603`](https://github.com/bangbang93/openbmclapi/commit/703e603d3dd5a999cfc86cbeb805597139e3b907)
- 不使用静态链接 [`58c695b`](https://github.com/bangbang93/openbmclapi/commit/58c695b6340cfb69957e471bdee34f6dca9ec931)
- zstd不兼容alpine [`4bc8474`](https://github.com/bangbang93/openbmclapi/commit/4bc847404fe8e4cec840947bfd513d95e97ac57d)

#### [v1.4.4](https://github.com/bangbang93/openbmclapi/compare/v1.4.3...v1.4.4)

> 12 July 2022

- Release 1.4.4 [`bf0c391`](https://github.com/bangbang93/openbmclapi/commit/bf0c3914b649de309c6fb1c5a301953c6317aa00)
- docker镜像提升至node 16 [`82c68bb`](https://github.com/bangbang93/openbmclapi/commit/82c68bb9b978d7c84b3e9233ca27c28d85a49c16)
- 掐连接可能没有res的content length [`455f2a9`](https://github.com/bangbang93/openbmclapi/commit/455f2a9f59e6c78edb52e17e0973cffbdffd4ddc)

#### [v1.4.3](https://github.com/bangbang93/openbmclapi/compare/v1.4.2...v1.4.3)

> 4 July 2022

- Release 1.4.3 [`7eb58db`](https://github.com/bangbang93/openbmclapi/commit/7eb58dbfc8d491ca7fda0dbbdc7675cb7f6070ce)
- ignore PCL drop connection [`a7e8ebc`](https://github.com/bangbang93/openbmclapi/commit/a7e8ebcde1991454e4697a3f75fc7521aa1912c6)

#### [v1.4.2](https://github.com/bangbang93/openbmclapi/compare/v1.4.1...v1.4.2)

> 4 July 2022

- Release 1.4.2 [`a0c2175`](https://github.com/bangbang93/openbmclapi/commit/a0c2175c13d8598314fe49219fd7c4d71afd82e8)
- fix nginx https [`f7f5bdc`](https://github.com/bangbang93/openbmclapi/commit/f7f5bdc6cbf13b2dd6fc5fbdc873f35dcfe43a96)

#### [v1.4.1](https://github.com/bangbang93/openbmclapi/compare/v1.4.0...v1.4.1)

> 4 July 2022

- Bump minimist from 1.2.5 to 1.2.6 [`#21`](https://github.com/bangbang93/openbmclapi/pull/21)
- Release 1.4.1 [`211e2ea`](https://github.com/bangbang93/openbmclapi/commit/211e2ea576e71133a035742c8b1765517d895c32)
- 云乞讨 [`971573f`](https://github.com/bangbang93/openbmclapi/commit/971573f019ecdc97bf93cd92d6245e43b3b2a015)
- fix pcl abort [`9409875`](https://github.com/bangbang93/openbmclapi/commit/9409875f0f89250b83d84b18ef692739bb933f3b)

#### [v1.4.0](https://github.com/bangbang93/openbmclapi/compare/v1.4.0-rc.2...v1.4.0)

> 16 June 2022

- upgrade deps [`007f8a8`](https://github.com/bangbang93/openbmclapi/commit/007f8a8a12c107ce8d43ec8bff8387993b22661f)
- Release 1.4.0 [`c6f37d0`](https://github.com/bangbang93/openbmclapi/commit/c6f37d08cde329c0cfd97e8e1713db2f5727b192)
- fix type [`8d9147b`](https://github.com/bangbang93/openbmclapi/commit/8d9147b4900b7e9ec559ed4761d6a9971c5cd963)

#### [v1.4.0-rc.2](https://github.com/bangbang93/openbmclapi/compare/v1.4.0-rc.1...v1.4.0-rc.2)

> 15 June 2022

- Release 1.4.0-rc.2 [`a8459ce`](https://github.com/bangbang93/openbmclapi/commit/a8459cefe5896cd1b02f6f04a0b0522fb9b631b7)
- 告诉服务端byoc [`6b68835`](https://github.com/bangbang93/openbmclapi/commit/6b68835695d0ee5db2e283914fed42c549c6ad47)

#### [v1.4.0-rc.1](https://github.com/bangbang93/openbmclapi/compare/v1.4.0-rc.0...v1.4.0-rc.1)

> 15 June 2022

- Release 1.4.0-rc.1 [`eb8b105`](https://github.com/bangbang93/openbmclapi/commit/eb8b105332e7d946227302d06823846439cf7497)
- fix nginx template [`2f1599d`](https://github.com/bangbang93/openbmclapi/commit/2f1599d8e0c37d3e016039295dfa96a88b0d0528)

#### [v1.4.0-rc.0](https://github.com/bangbang93/openbmclapi/compare/v1.3.0...v1.4.0-rc.0)

> 15 June 2022

- 支持byoc [`811a8d1`](https://github.com/bangbang93/openbmclapi/commit/811a8d1349ed8807f5c4963f3a647063b6918d4d)
- Create LICENSE [`0770721`](https://github.com/bangbang93/openbmclapi/commit/0770721c433e359ec63b4df6660270be7817deb6)
- Release 1.4.0-rc.0 [`4687a05`](https://github.com/bangbang93/openbmclapi/commit/4687a05fb571d6b44cc3ed4d19388a4081e0a381)
- 修正ws错误时异常退出 [`3440e0a`](https://github.com/bangbang93/openbmclapi/commit/3440e0ad09610018e48f4bfff067ee70f36242ae)
- fix CHANGELOG.md [`e88b2be`](https://github.com/bangbang93/openbmclapi/commit/e88b2be15c1a49a11712ac9b66e8995a518e79dc)

#### [v1.3.0](https://github.com/bangbang93/openbmclapi/compare/v1.2.3...v1.3.0)

> 10 February 2022

- http2 [`fe4fe98`](https://github.com/bangbang93/openbmclapi/commit/fe4fe9837f438f03c065b1a74bf10cf748c2c254)
- Release 1.3.0 [`0b066a0`](https://github.com/bangbang93/openbmclapi/commit/0b066a043d6640b239f1c2737c4206ef299ff334)

#### [v1.2.3](https://github.com/bangbang93/openbmclapi/compare/v1.2.2...v1.2.3)

> 8 February 2022

- nginx支持content-disposition [`76239ac`](https://github.com/bangbang93/openbmclapi/commit/76239ace37497dbe05b59420440f16afb02035e3)
- Release 1.2.3 [`bae39bf`](https://github.com/bangbang93/openbmclapi/commit/bae39bfe26650b3655a531deb546043010d987cc)

#### [v1.2.2](https://github.com/bangbang93/openbmclapi/compare/v1.2.1...v1.2.2)

> 19 January 2022

- Release 1.2.2 [`57f242b`](https://github.com/bangbang93/openbmclapi/commit/57f242bec41bea6de4f26ebad62639db2e9afb26)
- 修正measure [`c494ca3`](https://github.com/bangbang93/openbmclapi/commit/c494ca3ee05ea97b66b857806b9ab8cbd06cbb8d)

#### [v1.2.1](https://github.com/bangbang93/openbmclapi/compare/v1.2.0...v1.2.1)

> 13 January 2022

- npm audit [`87747f2`](https://github.com/bangbang93/openbmclapi/commit/87747f2c776e1918cc5c6674eadb566ef5c8188c)
- Release 1.2.1 [`8342418`](https://github.com/bangbang93/openbmclapi/commit/834241857e51e18610c13a7c68ae958800a8a9b2)
- 使用1M的buffer循环发送 [`e161eb6`](https://github.com/bangbang93/openbmclapi/commit/e161eb619f66c512a4050af494f368a947eda7ff)
- 再给个00 [`646beb0`](https://github.com/bangbang93/openbmclapi/commit/646beb0d08f1c8680e6f894ff5cab986ffefc4d9)
- 测速分配内存时不进行初始化 [`e845173`](https://github.com/bangbang93/openbmclapi/commit/e84517361fb3ac06cd5269d38b8c081cd4d251d1)

#### [v1.2.0](https://github.com/bangbang93/openbmclapi/compare/v1.1.0...v1.2.0)

> 23 December 2021

- 进程退出时，带着nginx一起结束 [`e003a02`](https://github.com/bangbang93/openbmclapi/commit/e003a02c866ff4c2ec766be3804554861e04bd70)
- Release 1.2.0 [`48e7ef9`](https://github.com/bangbang93/openbmclapi/commit/48e7ef99f668f47b837eca6789681ef090173db7)

#### [v1.1.0](https://github.com/bangbang93/openbmclapi/compare/v1.0.1...v1.1.0)

> 29 November 2021

- 支持nginx [`4addd38`](https://github.com/bangbang93/openbmclapi/commit/4addd3819c36aef044c4c9d7c191f034ac939552)
- 整个自动打包 [`9ff3974`](https://github.com/bangbang93/openbmclapi/commit/9ff3974b7cff1f1843d1f16f5b5422f249b9949a)
- Release 1.1.0 [`30efdb8`](https://github.com/bangbang93/openbmclapi/commit/30efdb8c4b403cd6c13e1a9f6a6ab0698f09d615)
- 优化代码 [`ce91975`](https://github.com/bangbang93/openbmclapi/commit/ce919756297d76c0a3ee9ed0dc4a72ab122cd1c8)
- 响应头添加hash [`8feb57d`](https://github.com/bangbang93/openbmclapi/commit/8feb57dbf3120493079ddbd19ad6f888492ac135)

#### [v1.0.1](https://github.com/bangbang93/openbmclapi/compare/1.0.0...v1.0.1)

> 22 November 2021

- Release 1.0.1 [`20bdd69`](https://github.com/bangbang93/openbmclapi/commit/20bdd6946623ee2137a8936f06db3247a0b63b2b)
- 修正ws断开但是重新连接成功时无法正确keep alive [`13d0517`](https://github.com/bangbang93/openbmclapi/commit/13d0517b5507fc2a6ba997f692c0f8c859bf3c0d)
- 修正tagName [`0325826`](https://github.com/bangbang93/openbmclapi/commit/0325826b88791efac101f3743e6f3ecde1fe93f2)

#### [1.0.0](https://github.com/bangbang93/openbmclapi/compare/v1.0.0...1.0.0)

> 20 November 2021

### [v1.0.0](https://github.com/bangbang93/openbmclapi/compare/v0.7.1...v1.0.0)

> 20 November 2021

- [skip ci] https init [`8611850`](https://github.com/bangbang93/openbmclapi/commit/86118500a50076da0807f11c6b3044068717e6a8)
- Release 1.0.0 [`82efd97`](https://github.com/bangbang93/openbmclapi/commit/82efd978ff5a7d4523a0b3d4ab275109add679b0)
- 支持https [`3353d2d`](https://github.com/bangbang93/openbmclapi/commit/3353d2dcd581a6e77b8c1b4809e844004d080423)
- [skip ci] 完善README [`fccdd6e`](https://github.com/bangbang93/openbmclapi/commit/fccdd6e268fe97886c289ac4040acedfd719b6ef)
- 增加打包脚本 [`e0b52b8`](https://github.com/bangbang93/openbmclapi/commit/e0b52b84811cfd505921fb5b5f842486ee0d9989)

#### [v0.7.1](https://github.com/bangbang93/openbmclapi/compare/v0.7.0...v0.7.1)

> 2 November 2021

- Release 0.7.1 [`8d8c548`](https://github.com/bangbang93/openbmclapi/commit/8d8c548669f5152b444e41130005e7a7d8af53b9)
- fix build [`ba3dfeb`](https://github.com/bangbang93/openbmclapi/commit/ba3dfeb5d77e186bc0971edea2732c5cb0ac8e37)

#### [v0.7.0](https://github.com/bangbang93/openbmclapi/compare/v0.6.0...v0.7.0)

> 2 November 2021

- 支持自行进程守护 [`9f33944`](https://github.com/bangbang93/openbmclapi/commit/9f3394400d4f2c6326f22fb8f22ec9bbca11a3c4)
- Release 0.7.0 [`4c6502b`](https://github.com/bangbang93/openbmclapi/commit/4c6502b3303bad9f4150569e6a46b0c11e3fc839)
- cacheDir使用cwd [`59cef40`](https://github.com/bangbang93/openbmclapi/commit/59cef4062e3e849dcfecbb4d4c945f6a7844ce07)
- 启动成功后给行彩色提示 [`fa7e307`](https://github.com/bangbang93/openbmclapi/commit/fa7e3070a0f561daeef00aaa5629a08e4d597a3b)

#### [v0.6.0](https://github.com/bangbang93/openbmclapi/compare/v0.5.1...v0.6.0)

> 18 September 2021

- 支持带宽测试 [`61bedfd`](https://github.com/bangbang93/openbmclapi/commit/61bedfdb8df9c87f125f5733f8300f3b778598ae)
- Release 0.6.0 [`34d222d`](https://github.com/bangbang93/openbmclapi/commit/34d222d1aca8b10e1334bc97ab76c7ba6fb9aa72)
- 优化同步丢失文件错误 [`59f9f90`](https://github.com/bangbang93/openbmclapi/commit/59f9f908b26e4c878906129c0443057f84f7cd01)
- 启用超时改为两分钟 [`20384c3`](https://github.com/bangbang93/openbmclapi/commit/20384c3dbed37df409e486dbd340646cde711ec2)

#### [v0.5.1](https://github.com/bangbang93/openbmclapi/compare/v0.5.0...v0.5.1)

> 26 August 2021

- Release 0.5.1 [`b38d922`](https://github.com/bangbang93/openbmclapi/commit/b38d922fea805f8ced2dbfb69c68768624181d92)
- gen changelog [`39f8377`](https://github.com/bangbang93/openbmclapi/commit/39f83772aee0f998bc2a3cb4758e13d8cf8aad32)
- 给got上一个全局的一分钟超时 [`8eee4ff`](https://github.com/bangbang93/openbmclapi/commit/8eee4ff98bbf6959c10c8eefcb70813e294cd84d)
- 修正无法解析nginx日志时崩溃 [`4c98c96`](https://github.com/bangbang93/openbmclapi/commit/4c98c96d7a4affea6412389ba449009e3af22862)
- fix build tag [`6ceccbe`](https://github.com/bangbang93/openbmclapi/commit/6ceccbe23f1049b613681f1d2e936ece24b235d5)

#### [v0.5.0](https://github.com/bangbang93/openbmclapi/compare/v0.4.2...v0.5.0)

> 20 August 2021

- 支持nginx作为静态文件服务器 [`743a904`](https://github.com/bangbang93/openbmclapi/commit/743a90460960c96a30b457b0046feebeaafa4e10)
- gitlab ci [`042c3da`](https://github.com/bangbang93/openbmclapi/commit/042c3da0a487a164442fc201f2fb1ac80abac09f)
- 升级到node14 [`182bc94`](https://github.com/bangbang93/openbmclapi/commit/182bc949da7296f51641d1a075cf1f96b549b6b1)
- 使用cmd构建docker [`ea86573`](https://github.com/bangbang93/openbmclapi/commit/ea865732e94061e654cd2f0d53ed8e71905cd82f)
- 修正脑残 [`4dc1e28`](https://github.com/bangbang93/openbmclapi/commit/4dc1e28153d4dad89cb7df9b86430f49eec3254a)

#### [v0.4.2](https://github.com/bangbang93/openbmclapi/compare/v0.4.1...v0.4.2)

> 10 August 2021

- 带tag的时候打tag [`02f8ecc`](https://github.com/bangbang93/openbmclapi/commit/02f8ecc3998f5c1a17ebf162be6f4811c081472b)
- build for docker-hub [`5e951c5`](https://github.com/bangbang93/openbmclapi/commit/5e951c508a016c3ca28e79d1095c57702da84d4c)
- Release 0.4.2 [`5e95373`](https://github.com/bangbang93/openbmclapi/commit/5e953738d9beb80503531807bf6896474aefd618)
- 优化代码 [`4365a88`](https://github.com/bangbang93/openbmclapi/commit/4365a88c9d8593e22856643168ff4ad5a7b11fae)
- 修正脑残 [`b582f9e`](https://github.com/bangbang93/openbmclapi/commit/b582f9ef9d0737e60514e2b4dff95252417188e3)
- 改个名字 [`50f1b65`](https://github.com/bangbang93/openbmclapi/commit/50f1b651d1467b9846b758ad2feeb44f1718f6d3)
- fix env [`8311462`](https://github.com/bangbang93/openbmclapi/commit/8311462d44655a4d25d8156a6646285d48f1e618)
- 优化路由使用 [`c8f4892`](https://github.com/bangbang93/openbmclapi/commit/c8f48925b235113c917f38a81a364865c106677e)
- socket.io最大尝试10次 [`4b16335`](https://github.com/bangbang93/openbmclapi/commit/4b16335fa2d30012026f875c7055301cc35adcac)

#### [v0.4.1](https://github.com/bangbang93/openbmclapi/compare/v0.4.0...v0.4.1)

> 9 August 2021

- Release 0.4.1 [`4050269`](https://github.com/bangbang93/openbmclapi/commit/405026975417be0937eef4a8b4ca10e4800a1296)
- 允许禁用请求日志 [`0890e97`](https://github.com/bangbang93/openbmclapi/commit/0890e971d87013cc4a6d1c686a27dbef711af0b1)

#### [v0.4.0](https://github.com/bangbang93/openbmclapi/compare/v0.3.7...v0.4.0)

> 3 August 2021

- Bump glob-parent from 5.0.0 to 5.1.2 [`#11`](https://github.com/bangbang93/openbmclapi/pull/11)
- Bump normalize-url from 4.5.0 to 4.5.1 [`#12`](https://github.com/bangbang93/openbmclapi/pull/12)
- regen lock [`48b1639`](https://github.com/bangbang93/openbmclapi/commit/48b16395aab62fedd080267f9b01e09fdf8db314)
- upgrade to socket.io 4 [`7b1aa58`](https://github.com/bangbang93/openbmclapi/commit/7b1aa58fe4395612a1e69fd6f5a95906992ca005)
- 更新eslint规则 [`0417a19`](https://github.com/bangbang93/openbmclapi/commit/0417a195f52f189081e2b326910bdac759104e37)
- Release 0.4.0 [`b874834`](https://github.com/bangbang93/openbmclapi/commit/b874834cd792dbed56d2d66a7da94e55e3c7c89b)
- 优化type [`d99c8db`](https://github.com/bangbang93/openbmclapi/commit/d99c8db276fea2bbbfdb4ff8bf3fa079451c5d04)
- keep alive出错时给个链接状态 [`ff56335`](https://github.com/bangbang93/openbmclapi/commit/ff563353f2a0cf7416ad13f9743b49493e51281d)

#### [v0.3.7](https://github.com/bangbang93/openbmclapi/compare/v0.3.6...v0.3.7)

> 21 July 2021

- Release 0.3.7 [`8b418a2`](https://github.com/bangbang93/openbmclapi/commit/8b418a2351aa0e3bbef65051809e0124b4ce860e)
- 修正keep-alive重试 [`f383e48`](https://github.com/bangbang93/openbmclapi/commit/f383e48bf05230b2f43349e89ee9a585e19ed6c4)

#### [v0.3.6](https://github.com/bangbang93/openbmclapi/compare/v0.3.5...v0.3.6)

> 21 July 2021

- Release 0.3.6 [`e6807a4`](https://github.com/bangbang93/openbmclapi/commit/e6807a4944ad5e424fef9def6042d48ef4f36edc)
- 改个description [`a483f6f`](https://github.com/bangbang93/openbmclapi/commit/a483f6f97f32f96d32409bdbb8ff3bc9159b4ad6)
- 修正disable重启错误 [`e527145`](https://github.com/bangbang93/openbmclapi/commit/e527145b6eb10545a24e72bf98e0e71c3f793d35)
- Update setup-centos.sh [`1a541d1`](https://github.com/bangbang93/openbmclapi/commit/1a541d119906db2dca609c6c93be4ddf8a410143)

#### [v0.3.5](https://github.com/bangbang93/openbmclapi/compare/v0.3.4...v0.3.5)

> 21 July 2021

- Bump socket.io-parser from 3.3.0 to 3.3.2 [`#13`](https://github.com/bangbang93/openbmclapi/pull/13)
- add gitlab ci [`a181293`](https://github.com/bangbang93/openbmclapi/commit/a1812932e63275220475a717c1bb296e48ac9ac8)
- Release 0.3.5 [`832c2e6`](https://github.com/bangbang93/openbmclapi/commit/832c2e6ec4d366327cf1a9200b19cc1f2f7b4b00)
- Update README.md [`1ba3cae`](https://github.com/bangbang93/openbmclapi/commit/1ba3caeafc1a3f6015157b6a94afcd8367f6931b)
- 修正disable重启错误 [`1584941`](https://github.com/bangbang93/openbmclapi/commit/15849411954551cec15356df39d6614ef45fc1b5)
- skip test [`6e6133f`](https://github.com/bangbang93/openbmclapi/commit/6e6133f0388106e68b58d4aa322b09c6f2e53a1d)
- 也就不需要模板字符串了 [`1ee17ed`](https://github.com/bangbang93/openbmclapi/commit/1ee17ed6b124d4bb4cc7ffa9ed7a74cd8a7ce341)

#### [v0.3.4](https://github.com/bangbang93/openbmclapi/compare/v0.3.3...v0.3.4)

> 5 June 2021

- gen changelog [`7cfc3e7`](https://github.com/bangbang93/openbmclapi/commit/7cfc3e756e97a99ee0614f11a358bf385b2283e4)
- Release 0.3.4 [`e6c5882`](https://github.com/bangbang93/openbmclapi/commit/e6c588229cf53abcf55c1aa6d9f23ec6bef15b42)
- 修正Windows下gc会删除所有文件 [`4621aff`](https://github.com/bangbang93/openbmclapi/commit/4621affc324b4d195853938a3d18c13eeea7885d)
- 使用.env [`5f4e696`](https://github.com/bangbang93/openbmclapi/commit/5f4e6966db69f6d7e99a3f32536357194dee3d5b)

#### [v0.3.3](https://github.com/bangbang93/openbmclapi/compare/v0.3.2...v0.3.3)

> 25 May 2021

- keep alive成功也给日志 [`84ed23d`](https://github.com/bangbang93/openbmclapi/commit/84ed23d09ffa6519545aaf74d37a8eea4ab48e14)
- Release 0.3.3 [`b5c202c`](https://github.com/bangbang93/openbmclapi/commit/b5c202c8730cb1edf146374c31b95e33a8af8762)

#### [v0.3.2](https://github.com/bangbang93/openbmclapi/compare/0.3.0...v0.3.2)

> 10 December 2020

- Bump lodash from 4.17.15 to 4.17.19 [`#7`](https://github.com/bangbang93/openbmclapi/pull/7)
- 支持删除过期文件 [`b10e6d0`](https://github.com/bangbang93/openbmclapi/commit/b10e6d07b8f94db11592dd8b0a1c39f825504dd8)
- socketio出错也按照连接错误处理 [`5022559`](https://github.com/bangbang93/openbmclapi/commit/5022559046ebd3ff140a8974595fe9a67a9b9fac)
- 更新下版本号 [`5c496d7`](https://github.com/bangbang93/openbmclapi/commit/5c496d7f78ad357147c8f61b14eaf17dc497fa3d)

#### [0.3.0](https://github.com/bangbang93/openbmclapi/compare/0.2.7...0.3.0)

> 13 July 2020

- 连续5次keep alive失败时，重试连接，若还是失败，则退出 [`b459319`](https://github.com/bangbang93/openbmclapi/commit/b459319041c87983cd3cf9fa4f32c8b4809f0555)
- Release 0.3.0 [`46cac41`](https://github.com/bangbang93/openbmclapi/commit/46cac417687811ffd13d2b09c981754d7bed2905)

#### [0.2.7](https://github.com/bangbang93/openbmclapi/compare/0.2.6...0.2.7)

> 12 July 2020

- 修正退出 [`0499218`](https://github.com/bangbang93/openbmclapi/commit/049921895ea3229b266dc3665e57de9e366102e5)
- npm audit fix [`67cc6f3`](https://github.com/bangbang93/openbmclapi/commit/67cc6f38430a2f8ac640bc0ce317936c50fc099f)
- setup-centos.sh [`b0da5b9`](https://github.com/bangbang93/openbmclapi/commit/b0da5b920371a2d21f556233d6fca537d5ac4c27)
- 日志体积限制 [`8bf61bc`](https://github.com/bangbang93/openbmclapi/commit/8bf61bc2d2bf574b05799f7e95e791269661c379)
- Release 0.2.7 [`58f1ca3`](https://github.com/bangbang93/openbmclapi/commit/58f1ca39ab11c2b6bd1d577995d04eb182b4478a)
- 掉线的时候把reason吐出来 [`3038573`](https://github.com/bangbang93/openbmclapi/commit/3038573cab58b9ffb9bbf0d6974e2d4f7c91aad8)
- fix docker-compose.yml [`7dd7068`](https://github.com/bangbang93/openbmclapi/commit/7dd7068de7654e47c89d5f1e26a3b1b2742c6682)
- 给个30天的缓存，反正url都是文件hash [`27177ec`](https://github.com/bangbang93/openbmclapi/commit/27177ec25fd092a55aca00b1de9ba91025c1523c)
- 掉线的时候暂时先不要重试心跳了 [`021cb64`](https://github.com/bangbang93/openbmclapi/commit/021cb64d10de5ddaad15136655e842a376ba2bac)

#### [0.2.6](https://github.com/bangbang93/openbmclapi/compare/0.2.5...0.2.6)

> 10 April 2020

- Release 0.2.6 [`95b804f`](https://github.com/bangbang93/openbmclapi/commit/95b804f432363deb7da584affbd5df3ce87c2107)
- 修正解构 [`e18f0f6`](https://github.com/bangbang93/openbmclapi/commit/e18f0f65fd1933315125e3c672605b5184462d83)
- 修正解构 [`93e041d`](https://github.com/bangbang93/openbmclapi/commit/93e041d7873b52e19614c8156a473e0bec57c797)

#### [0.2.5](https://github.com/bangbang93/openbmclapi/compare/0.2.4...0.2.5)

> 10 April 2020

- 优化错误处理 [`2839995`](https://github.com/bangbang93/openbmclapi/commit/28399957caf82d712b63e56e206e767010c42676)
- Release 0.2.5 [`033dfb6`](https://github.com/bangbang93/openbmclapi/commit/033dfb61f9308a807cfa75f420f2ab5cacb51fff)

#### [0.2.4](https://github.com/bangbang93/openbmclapi/compare/0.2.3...0.2.4)

> 26 March 2020

- add source-map-support [`1d92fe5`](https://github.com/bangbang93/openbmclapi/commit/1d92fe5dc5bc758f2ff31ef6ccf23b70582ebcaa)
- 连接错误处理 [`609289a`](https://github.com/bangbang93/openbmclapi/commit/609289afa170ec091a2e0addd277ca924e990801)
- Release 0.2.4 [`ec4b517`](https://github.com/bangbang93/openbmclapi/commit/ec4b517479ead2969c582f7e2cde9bd7fde21fc1)

#### [0.2.3](https://github.com/bangbang93/openbmclapi/compare/v0.1.0...0.2.3)

> 26 March 2020

- Bump acorn from 6.2.1 to 6.4.1 [`#5`](https://github.com/bangbang93/openbmclapi/pull/5)
- 使用websocket做心跳 [`51583a9`](https://github.com/bangbang93/openbmclapi/commit/51583a97e388eabbea67e471d56d20aa6f83f7e4)
- 掉线自动重连 [`7bd2c08`](https://github.com/bangbang93/openbmclapi/commit/7bd2c087f43ab4a314521aac3db0b1724b818d66)
- keep-alive时上报hits和bytes [`1d5f9d8`](https://github.com/bangbang93/openbmclapi/commit/1d5f9d8ea6758d08193d0cc0621f424c2aced8d6)
- 优化keep-alive [`3067478`](https://github.com/bangbang93/openbmclapi/commit/30674787c1a880bb016779e4e368a8d2a3825596)
- socket.io延后连接 [`8671289`](https://github.com/bangbang93/openbmclapi/commit/86712890353b6542ece73b8f423ac49d6d57656b)
- 修正流量统计 [`7f3e790`](https://github.com/bangbang93/openbmclapi/commit/7f3e7901ca537faf069f99c47879634c657d7ddf)
- fix clearTimeout [`e69ab82`](https://github.com/bangbang93/openbmclapi/commit/e69ab82699e61981282d15c6bcebc21922c4342d)
- error first callback [`d6e721f`](https://github.com/bangbang93/openbmclapi/commit/d6e721f8cecf51ee2f04cc367701c89e57b875f2)
- 给keepalive上个超时 [`2ba60cb`](https://github.com/bangbang93/openbmclapi/commit/2ba60cb7ec88b25807a7e228a8030615d8f0aee5)
- Release 0.2.3 [`e6fa738`](https://github.com/bangbang93/openbmclapi/commit/e6fa738618f95b784f607a5c6332ebd9b1f90186)
- disable release-it npm publish [`60ffa93`](https://github.com/bangbang93/openbmclapi/commit/60ffa93a1e79c416a778fd2519e3fe26e303eeb5)
- node 13.10.1有bug [`fda9e55`](https://github.com/bangbang93/openbmclapi/commit/fda9e5501c460b49d82a4d649812da1e1ee62f96)
- 给个timeout [`d10161e`](https://github.com/bangbang93/openbmclapi/commit/d10161ea2ce7640381c7ba32ee94fd5169cafe47)
- 优化log [`66f2cbf`](https://github.com/bangbang93/openbmclapi/commit/66f2cbfb54e73d2ed564c6d90500e960366d8ee7)
- 更新版本号 [`6a38b19`](https://github.com/bangbang93/openbmclapi/commit/6a38b192305cf57226403eb017fba082f4aec9ee)
- Update Dockerfile [`a8ad0d5`](https://github.com/bangbang93/openbmclapi/commit/a8ad0d5f23b0780752c522318ce70b42505de869)
- bump version [`4e59b1e`](https://github.com/bangbang93/openbmclapi/commit/4e59b1efc6037096f3c64dc3a73af9c2cdbdac6e)
- fix lint [`80ec5c6`](https://github.com/bangbang93/openbmclapi/commit/80ec5c6a0781ea367d4210eb61383093c3a296d6)
- fix keepalive [`7abbbc8`](https://github.com/bangbang93/openbmclapi/commit/7abbbc8f8d5cc2f58822807a80e7e48f73c81f1f)
- 给个string [`ea7b6cc`](https://github.com/bangbang93/openbmclapi/commit/ea7b6cc17b990e89c082d290bcd5472626c724b1)
- bump version [`c8a62ff`](https://github.com/bangbang93/openbmclapi/commit/c8a62ff292494c3f9a9d4ba2a7d7051fa3a832d7)
- 不使用xhr [`7bd3153`](https://github.com/bangbang93/openbmclapi/commit/7bd3153f6f4e127ae4facec0c68b637421728495)

#### v0.1.0

> 15 March 2020

- init [`e05d2ba`](https://github.com/bangbang93/openbmclapi/commit/e05d2ba244082e629fc7a0871cfca9e657c9635c)
- 实时进度条 [`d79726e`](https://github.com/bangbang93/openbmclapi/commit/d79726e0df79da6886ebaf9c58f34755bff1c8d5)
- 两遍就两遍吧 [`ef9ed8e`](https://github.com/bangbang93/openbmclapi/commit/ef9ed8e5a2d5da48f26a283713a3079949e998fb)
- add dockerfile [`ffe74f9`](https://github.com/bangbang93/openbmclapi/commit/ffe74f9bf5bfca6f697f4fda201a093a4568fa09)
- readme [`c07b9cc`](https://github.com/bangbang93/openbmclapi/commit/c07b9ccf012ae452f588be993a102b61c0473a3a)
- 似乎好像能初步试用了 [`97fa09b`](https://github.com/bangbang93/openbmclapi/commit/97fa09b143aa8aa7387a6b5e518738116123e65a)
- 带上UA [`906c74d`](https://github.com/bangbang93/openbmclapi/commit/906c74d0dba93b44119afe9513e993c24cc6a729)
- 补充文件 [`b831d09`](https://github.com/bangbang93/openbmclapi/commit/b831d09971aa0ce980b46047297bfb3c1c46af38)
- 每十分钟循环检查文件列表 [`c748a1b`](https://github.com/bangbang93/openbmclapi/commit/c748a1b11acc6e681a845a0659a17f9e551f03ed)
- 优化进度条 [`0e2282d`](https://github.com/bangbang93/openbmclapi/commit/0e2282d5b23a661c9b9ab4e764f6bf18cd3e9056)
- 优化错误信息 [`c4f6491`](https://github.com/bangbang93/openbmclapi/commit/c4f64911663d92dc175423c9564451404275935a)
- 允许强制退出 [`0eb4e6e`](https://github.com/bangbang93/openbmclapi/commit/0eb4e6ea32e58691a02629f3acf40d9a497cd598)
- keepAlive [`7ef3698`](https://github.com/bangbang93/openbmclapi/commit/7ef3698ace71ec7415aa528251530a74c849fd72)
- add docker-compose.yml [`081cf5a`](https://github.com/bangbang93/openbmclapi/commit/081cf5abb126516b766b7e134f9bb2af11a1e7bc)
- 添加实例 [`a433a93`](https://github.com/bangbang93/openbmclapi/commit/a433a93ac0fe8452f82a11fd3a90613b460be147)
- 掉线退出 [`742c7b1`](https://github.com/bangbang93/openbmclapi/commit/742c7b18b33dda09b87e90c8ffaffb37c240808b)
- 启动错误时给个错误信息 [`4255ffa`](https://github.com/bangbang93/openbmclapi/commit/4255ffa982102e5b4dd75f13a4e4f350d7ddcc78)
- ua里带版本 [`37f3cf4`](https://github.com/bangbang93/openbmclapi/commit/37f3cf4852bbc45d1f7aa0310c89eb859b298de1)
- keep alive出错的时候跳过当前 [`87c8ba2`](https://github.com/bangbang93/openbmclapi/commit/87c8ba2f6f986da9c41aa98df5dd69377d65fe43)
- 进度条使用大小 [`c5d2fc9`](https://github.com/bangbang93/openbmclapi/commit/c5d2fc921708f0e540dfac35e73ba069571b79df)
- README [`fec5b59`](https://github.com/bangbang93/openbmclapi/commit/fec5b594fa667cfde3c4574739ebc06c77019996)
- 修正文件判断 [`0a1d2ea`](https://github.com/bangbang93/openbmclapi/commit/0a1d2eaa232fb0921284b7513b4eb8321bd59f22)
- npm audit [`a2ff975`](https://github.com/bangbang93/openbmclapi/commit/a2ff97517525b72522a4cd68c0fd36522b8e1511)
- 临时优化日志 [`983f6d0`](https://github.com/bangbang93/openbmclapi/commit/983f6d0845b03916c6f6faa045fea2b528288e33)
- fix type [`7c5b259`](https://github.com/bangbang93/openbmclapi/commit/7c5b259b9cea1b07f3fbe14846b50c12742e67de)
- 支持文件名 [`23d3b9c`](https://github.com/bangbang93/openbmclapi/commit/23d3b9c4f9f7508f6bc1e2a398e6bb4293fc79f2)
- 允许公网监听不同端口 [`72f2078`](https://github.com/bangbang93/openbmclapi/commit/72f20785c5a9594bb65687efafadac77b63ffbb6)
- 改用console.log输出下载日志 [`c18b21e`](https://github.com/bangbang93/openbmclapi/commit/c18b21e9f0a299114613e6f60bf12f35ef91a477)
- 完善文档 [`97bbbfb`](https://github.com/bangbang93/openbmclapi/commit/97bbbfb2c68baecedeb63c9bf605add728a38926)
- 给个进度条 [`fda37fd`](https://github.com/bangbang93/openbmclapi/commit/fda37fdabb2d77e190a12362ae77b43e3990bb1c)
- host应该是可选项 [`886f04e`](https://github.com/bangbang93/openbmclapi/commit/886f04e6fc9660c34fbffb151824c20fc6f2dea3)
- 启动时上报版本 [`8bd47b0`](https://github.com/bangbang93/openbmclapi/commit/8bd47b04473cd1a69bbbcb990eedf926cd70a783)
- 下载的时候按照path排个序 [`446118d`](https://github.com/bangbang93/openbmclapi/commit/446118d79f7b7b20d035f54f7a362d0e74abc088)
- 修正掉线检测 [`20cc9a9`](https://github.com/bangbang93/openbmclapi/commit/20cc9a9a9bf611e33ad4332a94e51ff720e4b6ae)
- add readme [`bd2c49a`](https://github.com/bangbang93/openbmclapi/commit/bd2c49aa411e2413f76a4658d8509f0844ef347e)
- 修正docker-compose [`8c01c0b`](https://github.com/bangbang93/openbmclapi/commit/8c01c0bdf79784cb2b84e43aa219e19b3f28aa54)
- trust proxy [`c4ee024`](https://github.com/bangbang93/openbmclapi/commit/c4ee0247bf77dd1a3f857f28f3555170a0f67368)
- trust proxy [`ea63cfd`](https://github.com/bangbang93/openbmclapi/commit/ea63cfdc64ad5dddd7b74d0db0ccfb8b753129b6)
- 获取文件列表接口上个缓存 [`6bda5e0`](https://github.com/bangbang93/openbmclapi/commit/6bda5e0767b174532d409f06dc483749ca864c46)
- 修正url [`814a8c7`](https://github.com/bangbang93/openbmclapi/commit/814a8c72c8dad6e39f946994a0ac309446476dc5)
- 调整日志格式 [`a82884a`](https://github.com/bangbang93/openbmclapi/commit/a82884a4da8b3d1e2f21d7b94a240a8539ff5960)
- 使用volume [`d221bd8`](https://github.com/bangbang93/openbmclapi/commit/d221bd84260868a77a9de64978f05371bb57de43)
- 修正ua [`d8599ae`](https://github.com/bangbang93/openbmclapi/commit/d8599ae39c58c9e6464fa3cacae0617a634216d6)
- 优化路径拼接 [`4148365`](https://github.com/bangbang93/openbmclapi/commit/41483658053e66facd0acda7a63b7de4ea9f6b23)
- use https [`65b8af3`](https://github.com/bangbang93/openbmclapi/commit/65b8af3d02396a0446fe3c3316e6c3923b221b4c)
- 改成公网域名 [`9c74a8d`](https://github.com/bangbang93/openbmclapi/commit/9c74a8d6908f8227b47c9b35c44e8891ccd4881b)
- 使用buffer下载 [`be2094e`](https://github.com/bangbang93/openbmclapi/commit/be2094e73a91752a618929ae2c2f544e72ca12ee)
- trust proxy [`0f4b041`](https://github.com/bangbang93/openbmclapi/commit/0f4b041976054828afe42341777e725cbeefd9c0)
- 添加volume [`df6ca41`](https://github.com/bangbang93/openbmclapi/commit/df6ca41a869b0bfdc44af1ed0c6c362d469abc0d)
- 暴露4000端口 [`84ea141`](https://github.com/bangbang93/openbmclapi/commit/84ea1414511f0e2de4e1383f630749b6383240b7)
- 加一行log [`51793c7`](https://github.com/bangbang93/openbmclapi/commit/51793c7c53800fc0a0428bd916f195719e401683)
- 下载文件的时候也带上auth吧 [`8c52b86`](https://github.com/bangbang93/openbmclapi/commit/8c52b86113f45da0e69b7c93e383cf1e36496b65)
