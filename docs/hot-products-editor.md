# 热门产品：隐藏编辑开关说明

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
2. 页面右上角（搜索框旁）会出现按钮：`热门编辑：开/关`
3. 同时会出现按钮：`授权/已授权`（用于建立/清除编辑会话）
3. 点击「开」后，每个产品卡片左下角会出现编辑控件：
   - 勾选框：是否热门
   - 排序输入框：1~10（可留空表示不指定排序）

产品列表页额外提供快捷筛选：
- 搜索框右侧有「热门」按钮，可一键筛选当前所有热门产品（等价于 URL 参数 `?hot=1`）

## 操作流程（你实际怎么用）
1. 启动服务端 API（见下文“服务端如何设置口令/运行”）
2. 打开：`/products?__hot=1`
3. 点击「编辑热门」，输入口令并进入编辑模式
4. 编辑模式下右上角会出现「操作」和「完成」
5. 在卡片上勾选「热门」，并填写/清空排序（1~10）
6. 任意修改会自动保存到服务端文件；首页「热门产品」会自动刷新（不改 UI）
7. 点击「完成」退出编辑（会清除授权会话，下次需重新授权）

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

> 建议：生产环境尽量不要用 `__token` 方式（URL 可能进入浏览器历史、服务器 access log、分享时泄露）。更推荐手动点「授权」输入。

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

开发环境：
- 终端1：`HOT_EDITOR_TOKEN=你的口令 npm run api`
- 终端2：`npm run dev`（`vite.config.ts` 已把 `/api` 代理到 `http://localhost:5175`）

生产环境：
- 确保前端同域下 `/api/*` 能转发到 Node API 服务（例如 Nginx 反代）
- 口令建议通过环境变量注入（不要写进前端代码/不要提交到仓库）

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

## 常见问题：为什么每次操作都要重新授权？
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

## 影响范围
- 产品列表页：显示「热门」角标（含 `#hotRank`）
- 首页：监听 `xw:hot-products-changed` 事件，实时刷新热门产品数据（不改 UI，只变数据来源/排序）
