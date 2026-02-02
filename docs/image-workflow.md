# 图片更新与懒加载资源生成流程

当你替换/新增 `public/images/**` 下的图片时，需要同时生成：
- 低质量占位图（`*-small.*`），用于懒加载兜底与渐进式显示
- 现代格式（`.webp` / `.avif`），用于 `<picture>` 优先加载

如果只替换了 `xxx.jpg`，但没有生成 `xxx.webp`/`xxx.avif`（以及 `xxx-small.*`），在支持 AVIF/WebP 的浏览器里可能会出现图片“无法加载/一直失败”的情况。

## 适用范围
- 静态资源目录：`public/images/**`
- 常见使用场景：产品图、首页/模块图、品牌图等（代码里常用 `LazyPicture` + `generatePlaceholderUrl`）

## 标准操作（推荐）

### 1) 替换/新增原图
1. 把图片放回正确目录，例如：`public/images/products/adcmt/7355.jpg`
2. 文件名必须与代码引用一致（例如：`src/data/products/products.js` 里的 `getAssetUrl("/images/products/adcmt/7355.jpg")`）

### 2) 生成占位图与现代格式
在项目根目录执行：

```bash
npm run generate-thumbnails
npm run generate-modern-images
```

或一条命令：

```bash
npm run generate-thumbnails && npm run generate-modern-images
```

### 3) 自检（是否生成齐全）
以 `7355.jpg` 为例，目录里至少应出现：
- `7355-small.jpg`（占位图）
- `7355.webp`、`7355.avif`（现代格式）
- `7355-small.webp`、`7355-small.avif`（占位图的现代格式）

## 批量改图建议
- 一次性替换/新增多张原图后，再统一执行一次脚本即可（不需要每张图都跑一遍）。

## 开发与构建时机
- `npm run dev` / `npm run build` 会通过 `predev` / `prebuild` 自动执行上述脚本（见 `package.json`）。
- 如果你在 **开发服务器已启动后** 才替换图片：需要手动执行脚本，或重启 `npm run dev`。

