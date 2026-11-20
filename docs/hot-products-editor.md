# 热门产品管理：入口与维护说明

## 快速入口

热门产品管理位于产品列表页，通过 URL 参数显示编辑入口，无需从顶部菜单进入。

| 使用场景 | 访问地址 |
| --- | --- |
| 本地开发 | [打开热门管理](http://localhost:5174/products?__hot=1) |
| 线上站点 | 在网站域名后加 `/products?__hot=1` |
| 已有查询参数 | 在产品页地址后追加 `&__hot=1`，例如 `/products?type=new&__hot=1` |
| 只查看热门 | `/products?hot=1`，仅筛选，不打开管理入口 |

`__hot` 前是两个下划线。普通 `/products` 页面不显示「编辑热门」。如果站点部署在子目录下，地址也需保留部署前缀，例如 `/站点目录/products?__hot=1`。

进入后点击搜索框旁的「编辑热门」，输入服务端配置的口令；在产品卡片上勾选热门、填写排序（1～10，数字越小越靠前）。修改自动保存，结束后点击「完成」。可以收藏不含口令的入口地址，方便下次进入。

## 背景
首页「热门产品」展示的数据来源于产品列表数据（`src/data/products/products.js`），避免出现两份数据重复维护。

为了在不做“管理员系统”的前提下，支持你在浏览器里**手动勾选/排序热门产品**，产品列表页提供了一个**隐藏的编辑模式**（普通访客不可见）。

> 注意：这不是完整的后台权限系统，只是“对外隐藏 + 口令授权写入”。拿到编辑口令的人仍可修改热门配置。

## 默认热门来源（代码维护）
在 `src/data/products/products.js` 中：
- `isHot: true`：标记为热门
- `hotRank: 1..10`：热门排序（数字越小越靠前）

首页会优先使用带 `hotRank/isHot` 的产品生成 10 个热门；没有标记时会兜底取前 10 个产品。

## 整体工作方式（重要）
- **配置存在哪里**：服务器端文件 `data/hot-products.json`（对所有用户生效）
- **谁能改**：只有通过口令授权后的浏览器会话能写入（服务端签发 `HttpOnly Cookie`）
- **前端为什么需要服务端**：浏览器不能直接写服务器文件；必须由服务端接收请求并写入文件

## 隐藏开关：如何进入编辑模式
1. 打开产品列表页，并带上参数：`/products?__hot=1`
2. 页面右上角（搜索框旁）会出现按钮：`编辑热门`
3. 点击「编辑热门」后会提示输入口令（服务端环境变量 `HOT_EDITOR_TOKEN`）
4. 授权成功后进入编辑模式，每个产品卡片左下角会出现编辑控件：
   - 勾选框：是否热门
   - 排序输入框：1~10（可留空表示不指定排序）

产品列表页额外提供快捷筛选：
- 搜索框右侧有「热门」按钮，可一键筛选当前所有热门产品（等价于 URL 参数 `?hot=1`）

## 操作流程（你实际怎么用）
1. 启动服务端 API（见下文“服务端如何设置口令/运行”）
2. 打开：`/products?__hot=1`
3. 点击「编辑热门」，输入口令并进入编辑模式（已授权过且 Cookie 未过期时不会重复弹口令）
4. 编辑模式下右上角会出现「操作」和「完成」
5. 在卡片上勾选「热门」，并填写/清空排序（1~10）
6. 任意修改会自动保存到服务端文件；首页「热门产品」会自动刷新（不改 UI）
7. 点击「完成」退出编辑（默认不会清除授权 Cookie，下次点「编辑热门」可直接进入）

## 编辑内容保存在哪里
热门配置保存在服务器端文件（默认路径：`data/hot-products.json`），通过 API 读写：
- 读取：`GET /api/hot-products`
- 写入：`PUT /api/hot-products`（需要已授权的 Cookie 会话）

浏览器端仅保存“是否显示编辑 UI”：
- `localStorage: xw:hot-editor:enabled`：是否开启编辑 UI（仅在 `__hot=1` 时可见）
编辑口令不会保存在本地存储中；授权后由服务端签发 `HttpOnly Cookie` 用于后续写入。

因此：
- 热门配置对所有访客生效（服务器统一读取）
- 口令不会暴露给普通访客（但这不是权限系统）

## 一次性授权（可选）
如果你希望“点开链接就自动授权”，可以使用一次性参数（授权完成后会自动从 URL 移除）：
- `/products?__hot=1&__token=你的口令`

> 建议：生产环境尽量不要用 `__token` 方式（URL 可能进入浏览器历史、服务器 access log、分享时泄露）。更推荐手动点「编辑热门」输入。

## 排序规则与“可删除排序号”
- `hotRank` 允许 1~10，且会尽量保持唯一（同一名次只允许一个产品）
- 将排序号输入框清空，会写入覆盖值 `hotRank: null`，表示**明确清除默认排序号**（避免回退显示代码里的默认 `hotRank`）

## 如何重置
在 `__hot=1` 且「热门编辑」为开时：
- 点击「恢复默认」：清空服务端覆盖配置，回到代码默认热门（`src/data/products/products.js` 里的 `isHot/hotRank`）
- 点击「清空热门」：写入 `disableAllHot=true`，覆盖代码默认热门，使全站默认不显示任何热门；之后你可以再手动勾选少量热门并设置排序

## 服务端如何设置口令/运行（文件存储）
本项目提供了一个轻量服务端（不需要数据库）：
- 启动：`npm run api`
- 关键环境变量：
  - `HOT_EDITOR_TOKEN`：编辑口令（必填，否则禁止写入）
  - `HOT_PRODUCTS_FILE`：数据文件路径（可选，默认 `data/hot-products.json`）
  - `PORT`：API 端口（可选，默认 `5175`）
  - `HOT_EDITOR_COOKIE_MAX_AGE`：授权 Cookie 有效期（可选，默认 30 天）
  - `HOT_EDITOR_COOKIE_DOMAIN`：Cookie 域（可选，跨子域部署时需要，例如 `.xwtest.com.cn`）
  - `HOT_EDITOR_COOKIE_SECURE`：强制 Secure Cookie（可选，`1/true` 开启；HTTPS 反代下也会自动加 Secure）

### API 边界与部署说明

- 请求体上限为 64 KiB，超限返回 `413`；排名必须是 1～10 的整数或 `null`，覆盖配置中的排名不得重复，非法输入返回 `400`。
- 登录接口按直接连接 IP 限制每 15 分钟最多 10 次尝试，成功后清零，超限返回 `429` 与 `Retry-After`。服务不信任客户端提供的转发 IP；反向代理后多个访客可能共享该限制，建议网关另外设置真实客户端 IP 限流。
- Cookie 包含随机值与签名过期时间，服务器也会检查过期。升级前的旧 Cookie 需要重新授权。退出授权清除当前浏览器 Cookie；更换 `HOT_EDITOR_TOKEN` 可使所有旧会话失效。
- 单进程内写入按顺序执行，使用唯一临时文件原子替换。多个编辑者仍采用整份配置最后写入生效的规则；不要让多个 API 实例共用此 JSON 文件。

### 本地启动步骤

在仓库根目录打开两个终端，均先使用项目指定的 Node `22.21.1`。

终端 1：启动热门配置 API（默认端口 `5175`）。示例中的口令需替换为自己设置的值，浏览器编辑时输入相同口令。

```bash
nvm use
HOT_EDITOR_TOKEN='替换为你设置的口令' npm run api
```

终端 2：启动前端（默认端口 `5174`）。

```bash
nvm use
npm run dev
```

然后访问 `http://localhost:5174/products?__hot=1`。`vite.config.ts` 已把 `/api` 代理到 `http://localhost:5175`；只启动前端可以显示编辑按钮，但无法完成授权和保存。前端已运行时可复用现有服务，无需再次启动。

### 生产环境要求

- 确保前端同域下 `/api/*` 能转发到 Node API 服务（例如 Nginx 反代）
- 口令建议通过环境变量注入（不要写进前端代码/不要提交到仓库）
- 本地与线上分别使用各自 API 的数据文件；本地编辑不会自动同步到线上。
- 部署前备份实际使用的 `HOT_PRODUCTS_FILE`（默认 `data/hot-products.json`），避免发布时覆盖运营配置。

### 生产环境口令示例
任选一种方式设置环境变量 `HOT_EDITOR_TOKEN`：

- 临时启动（当前 shell 生效）：
  - `export HOT_EDITOR_TOKEN='你的强口令'`
  - `node server/hot-products-server.mjs`

- systemd（推荐）：
  - 在 unit 文件中加入：`Environment=\"HOT_EDITOR_TOKEN=你的强口令\"`
  - 然后 `systemctl daemon-reload && systemctl restart <service>`

### 使用 PM2 启动（可选）
如果你用 PM2 管理进程，可以这样启动：

- 启动（推荐：在同一行注入环境变量）：
  - `HOT_EDITOR_TOKEN='你的强口令' PORT=5175 HOT_PRODUCTS_FILE=/home/app/xwtest/data/hot-products.json pm2 start xw-hot-products-api/hot-products-server.mjs --name xw-hot-products-api --interpreter node`
- 查看/日志：
  - `pm2 status`
  - `pm2 logs xw-hot-products-api`
- 重启：
  - `pm2 restart xw-hot-products-api`
- 开机自启：
  - `pm2 save`
  - `pm2 startup`

> 提醒：`pm2 start ... --env production` 的 `--env` 用法是用于 ecosystem 配置里的环境选择，不是用来传入 `KEY=VALUE`。

### XWTEST-PRD：找回失败后的口令重设与服务恢复

2026-11-20 通过 Termius 的 XWTEST 会话只读检查确认：

- 服务器名：`XWTEST-PRD`。
- API 脚本：`/home/app/xw-hot-products-api/hot-products-server.mjs`。
- 现有热门数据：`/home/app/xwtest/data/hot-products.json`，恢复时必须显式指定此文件。
- Nginx 网站配置将 API 转发到 `127.0.0.1:5175`；检查时该端口未监听，PM2 当前进程列表中没有热门产品 API。
- 历史日志曾记录 `token: configured`，后续启动记录为 `token: missing`；PM2 保存配置及备份未包含口令值，旧口令未找回。
- 本次检查未设置新口令，也未启动或修改线上服务。以上是检查时状态，执行恢复前先运行 `pm2 status` 确认当前状态。

**固定口令：`xwtest`。** 这是维护者指定的新口令，当前仅记录在文档中，尚未应用到线上服务。执行下方启动或重启步骤后，使用此口令进入「编辑热门」。

在 Termius 的 XWTEST 终端设置口令环境变量：

```bash
export HOT_EDITOR_TOKEN='xwtest'
```

如果 `pm2 status` 中没有 `xw-hot-products-api`，执行：

```bash
PORT=5175 \
HOT_PRODUCTS_FILE=/home/app/xwtest/data/hot-products.json \
pm2 start /home/app/xw-hot-products-api/hot-products-server.mjs \
  --name xw-hot-products-api \
  --interpreter node
```

如果该应用已存在，改为更新环境变量并重启，避免重复创建：

```bash
PORT=5175 \
HOT_PRODUCTS_FILE=/home/app/xwtest/data/hot-products.json \
pm2 restart xw-hot-products-api --update-env
```

启动或重启成功后保存 PM2 配置，清除当前 shell 中的口令变量，再检查状态：

```bash
pm2 save
unset HOT_EDITOR_TOKEN
pm2 status
pm2 logs xw-hot-products-api --lines 10 --nostream
```

确认应用状态为 `online`，最新启动日志为 `token: configured`，且数据路径为 `/home/app/xwtest/data/hot-products.json`。日志可能包含旧的 `token: missing`，应以本次启动的最新记录为准。

随后访问网站的 `/products?__hot=1`，点击「编辑热门」并输入新口令，验证授权。上述步骤继续使用已有数据，不执行「恢复默认」或「清空热门」。

## 常见问题：入口、授权与保存

| 现象 | 检查方式 |
| --- | --- |
| 找不到「编辑热门」 | 确认当前在产品列表页，地址含 `__hot=1`，不是仅有 `hot=1`；按钮位于搜索框旁。 |
| 提示暂时无法授权 | 确认 API 已启动；本地检查 `5175` 服务，线上检查 `/api` 反向代理。 |
| 提示口令不正确 | 使用当前 API 进程的 `HOT_EDITOR_TOKEN`；未设置时无法授权，修改环境变量后需要重启 API。 |
| 提示授权尝试过于频繁 | 等待 15 分钟后再试，避免反复提交。 |
| 提示保存失败 | 检查 API 日志、数据文件目录写入权限和网络请求；失败时页面会尝试重新读取服务端配置，不要把当前显示视为已保存。 |
| 点击「完成」后再次编辑不问口令 | 正常行为：「完成」仅退出编辑 UI，未清除授权 Cookie。 |
| 线上未显示本地修改 | 检查访问的环境与 API 数据文件；本地数据不会自动发布到线上。 |

保存后可刷新产品页确认热门标记与排序，再返回首页检查展示结果。

### 为什么每次操作都要重新授权？
正常情况下，授权成功后会写入一个 `HttpOnly Cookie`（默认有效期 30 天），所以不需要每一步都授权。

如果你遇到“每操作一步就弹授权/变回未授权”，通常原因是 **Cookie 没有被浏览器保存，或没有被转发到 API**：

1. 反代/网关把 `Set-Cookie` 去掉了  
   - 检查：浏览器 DevTools -> Network -> `POST /api/hot-products/session` 响应是否包含 `Set-Cookie: xw_hot_editor=...`
2. 反代没有把请求中的 `Cookie` 头转发给 Node  
   - 检查：后续 `GET /api/hot-products/session` 是否能返回 `{"authorized":true}`
3. 域名不一致（例如 `www.xwtest.com.cn` 与 `xwtest.com.cn` 来回跳）  
   - 解决：统一站点域名，或设置 `HOT_EDITOR_COOKIE_DOMAIN=.xwtest.com.cn`
4. HTTPS 站点但 Cookie 未被接受（尤其跨子域/严格策略环境）  
   - 解决：确保走同域 `/api` 反代；必要时设置 `HOT_EDITOR_COOKIE_SECURE=1`

如果你希望手动“退出授权”，可以：
- 清理浏览器该站点的 Cookie
- 或从当前浏览器会话调用：`DELETE /api/hot-products/session`，让响应清除该浏览器的 Cookie

## 维护代码定位

| 文件 | 职责 |
| --- | --- |
| `src/components/products/ProductsPageView.vue` | 编辑入口、「操作」菜单、产品卡片编辑控件 |
| `src/composables/products/useHotEditorState.ts` | 隐藏开关、口令授权、编辑状态、保存与排序逻辑 |
| `src/utils/hotProducts.ts` | API 请求、配置合并与变更通知 |
| `server/hot-products-server.mjs` | 口令校验、Cookie 会话、配置校验及文件读写 |
| `src/data/products/products.js` | 产品基础数据及默认热门标记 |
| `data/hot-products.json` | 服务端保存的热门覆盖配置（可由 `HOT_PRODUCTS_FILE` 改址） |
| `vite.config.ts` | 本地 `/api` 代理与部署路径 `base` |

## 影响范围
- 产品列表页：显示「热门」角标（含 `#hotRank`）
- 首页：监听 `xw:hot-products-changed` 事件，实时刷新热门产品数据（不改 UI，只变数据来源/排序）
