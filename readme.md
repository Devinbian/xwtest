# 项目结构（关键目录）

`src/data/`
- `src/data/home/`：首页数据源（主营产品、行业、服务、合作品牌、热门产品等）
- `src/data/navigation/`：主导航菜单数据源
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

# 构建与预览
- 构建：`npm run build`
- 预览：`npm run preview`

# 体验优化计划
- 见：`docs/ux-optimization-plan.md`
