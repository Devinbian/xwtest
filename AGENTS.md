# 仓库指南

## 项目结构与模块组织
- `src/`：Vue 应用主代码目录。
- `src/views/`：路由页面；`src/components/`：可复用组件。
- `src/data/`：首页与产品等静态数据；`src/utils/`：工具函数。
- `src/styles/`：SCSS 变量、布局与全局样式。
- `public/`：静态资源与生成后的多格式图片文件。
- `server/hot-products-server.mjs`：可选的本地热门产品 API，写入 `data/hot-products.json`。
- `scripts/images/`：图片处理脚本；`scripts/code-health/`：未使用组件/页面检查脚本。
- `docs/`：图片流程、热门产品编辑等操作文档。

## 构建、测试与开发命令
执行前请先使用 Node `22.21.1`（`nvm use`）。
- `npm ci`：按锁文件安装依赖。
- `npm run dev`：启动 Vite 开发服务（`http://localhost:5174`，会先执行 `predev` 生成图片）。
- `npm run api`：启动热门产品 API（`http://localhost:5175`，需设置 `HOT_EDITOR_TOKEN`）。
- `npm run build`：构建生产包到 `dist/`（会先执行 `prebuild`）。
- `npm run preview`：本地预览构建产物。
- `npm run find-unused-components` / `npm run find-unused-views`：代码健康检查。

## 代码风格与命名规范
- 技术栈：Vue 3 + TypeScript + SCSS，优先使用 `<script setup lang="ts">`。
- 与现有代码保持一致：`.vue`、`.ts`、`.scss` 使用 2 空格缩进。
- 组件/页面文件使用 PascalCase，如 `ProductCard.vue`、`Home.vue`。
- 工具与数据模块使用 camelCase 或小写命名，如 `hotProducts.ts`、`categories.js`。
- `src` 下模块导入优先使用 `@/` 别名。
- 仓库未强制配置 lint/formatter，大范围重构前先对齐周边文件风格。

## 测试要求
- 当前未配置自动化测试框架。
- 提交 PR 前至少完成以下验证：
1. 执行 `npm run build` 并确认成功。
2. 执行 `npm run dev`，冒烟检查核心路由（`/`、`/products`、`/contact`）。
3. 修改组件或路由时运行 code-health 脚本。
- 在 PR 描述中写明手工验证步骤与结果。

## 提交与合并请求规范
- 现有历史以短小、任务导向提交为主（如 `重构3`、`修改图片`），也有英文祈使句风格。
- 新提交建议使用“范围 + 动作”格式，例如：`products: 修复占位图路径`。
- PR 需包含：
1. 变更摘要与影响路径；
2. 关联 issue/背景；
3. UI 变更截图或短视频；
4. 已执行命令与验证结果。

## 安全与配置提示
- 不要提交密钥；`HOT_EDITOR_TOKEN` 必须通过环境变量注入。
- 部署目标变更前，请检查 `vite.config.ts` 中 `base` 配置。
- 图片资源请通过脚本再生成，不要手工改动 `public/images/` 产物。
