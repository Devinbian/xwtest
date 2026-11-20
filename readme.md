# 项目结构（关键目录）

`src/data/`
- `src/data/home/`：首页数据源（主营产品、行业、服务、合作品牌等）
- `src/data/products/`：产品页数据源（`products.js`、`categories.js`）

`scripts/`
- `scripts/images/generate-thumbnails.cjs`：生成图片缩略图（`*-small.jpg`）
- `scripts/images/generate-modern-images.cjs`：生成 WebP/AVIF + 缺失的 JPG 兜底
- `scripts/code-health/`：粗略扫描未使用组件/页面

# 本地启动

## 1) Node 版本
- 推荐使用 `nvm`：执行 `nvm use`（版本见 `.nvmrc`，当前为 `22.21.1`）

## 2) 安装依赖
- `npm install`（或 `npm ci`）

## 3) 启动开发服务器
- `npm run dev`
- 默认端口：`5174`（见 `vite.config.ts`），访问 `http://localhost:5174`

> 说明：`dev/build` 会先自动执行图片处理脚本（`predev`/`prebuild`），用于懒加载与现代格式输出。

## 4) （可选）启动热门产品配置 API
- `HOT_EDITOR_TOKEN=你的口令 npm run api`
- 默认端口：`5175`（见 `server/hot-products-server.mjs`），开发环境下 `/api` 会被代理到该端口

# 构建与预览
- 构建：`npm run build`
- 预览：`npm run preview`

# 质量检查
- 类型检查（Vue SFC）：`npm run typecheck`
- TypeScript 检查：`npm run typecheck:ts`
- 代码健康检查：`npm run lint`
- 回归测试：`npm test`（使用 Node 内置测试工具，API 测试仅使用临时文件和随机端口）

# 部署 base 配置
- 默认 `base` 为 `/`
- 子路径部署（如 GitHub Pages）时，构建前设置：
  - `VITE_BASE_PATH=/xwtest/ npm run build`
- GitHub Pages 工作流：`.github/workflows/deploy.yml`
- XWTEST 服务器发布工作流：`.github/workflows/deploy-server.yml`；首次配置、手动发布及自动发布开关见 [服务器发布说明](docs/server-deployment.md)。

构建会为 `/products`、`/shop`、`/about`、`/services`、`/brands`、`/contact` 生成独立的 `目录/index.html` 入口，因此 GitHub Pages 能直接访问和刷新这些 History 路由（静态服务器可能补上末尾 `/`）。新增路由时需同时更新 `src/data/sitePages.ts`。

各入口包含独立标题和描述，客户端切换页面时也会同步更新；页面正文仍由 Vue 渲染，并非 SSR。
设置 `SITE_ORIGIN=https://你的域名` 后，构建会生成包含部署前缀的 `sitemap.xml`，可提交到搜索平台；不设置时不会猜测网站域名。GitHub Pages 工作流已配置默认域名，使用自定义域名时请同步修改。

GitHub Pages 仅托管静态站点，热门编辑仍需另行运行 Node API 并配置同域 `/api` 反向代理；纯静态部署下使用代码中的默认热门产品。

# 图片更新流程
- 见：`docs/image-workflow.md`

# 热门产品编辑（隐藏开关）
- 见：`docs/hot-products-editor.md`
