# TODO：18 微交互动画 & 19 渐进式展示（按页面对照）

> 目标：不是“有没有动画”，而是把交互反馈做成**一致、轻量、可访问、可控**；并让首屏更快、非首屏更省。

## 18. 添加微交互动画（补齐 + 统一）

### 全局一致性（建议先做）
- [ ] 统一交互态：`default / hover / active(press) / focus-visible / disabled` 的视觉规则与过渡时长（优先复用 `src/styles/_variables.scss` token）。
- [ ] 为所有 `:disabled` 按钮补齐明确的禁用态（尤其是轮播/分页按钮）：看起来“不可点”，而不是只是没反应。
- [ ] 为“可切换”的按钮补齐语义（可选）：如筛选项使用 `aria-pressed`（切换类按钮），避免只能靠颜色判断。

### 首页 `src/views/Home.vue`
- [ ] 合作品牌轮播左右按钮/圆点：补齐 `:active`（按压）与 `:disabled` 样式一致性（目前有 hover，但禁用态不一定明显）。
- [ ] 合作品牌卡片“3D 跟随”效果：在 `prefers-reduced-motion` 下禁用；并在触摸设备（`(pointer: coarse)`）下关闭或降级（避免误触/耗电）。
- [ ] 热门产品“了解更多”按钮：补齐按压态与键盘 focus（目前已有 hover，进一步统一）。

### 产品页 `src/views/Products.vue`
- [ ] 左侧筛选（分类/品牌）按钮：补齐 `:active`（移动端更关键），并统一 active 样式（选中态/hover 态不要混淆）。
- [ ] 顶部“已选筛选项” chip：按压态、focus-visible（键盘）一致，`x` 图标点击区域更明确。
- [ ] 产品卡“更多/收起”：切换时箭头/文字轻反馈（例如旋转/透明度），但只用 `transform/opacity`。

### 导航 `src/components/TheNavigation.vue`
- [ ] 顶部联系方式链接：补齐 `:active`（移动端）与 focus-visible（键盘）一致。
- [ ] 移动端菜单按钮（汉堡）：按压反馈/禁用态（打开时也可以有“已打开”视觉状态）。

### 咨询弹窗 `src/components/QuoteDialog.vue`
- [ ] “复制”按钮：复制成功除了文案切换（已做），建议再加轻量状态（颜色/边框/小图标）并加 `aria-live="polite"` 的提示区域（可访问性）。

## 19. 实施渐进式展示（首屏优先 + 非首屏延后）

### 首页 `src/views/Home.vue`（收益最大）
- [ ] 非首屏区块延后渲染：合作品牌 / 八大行业 / 主营产品 / 我们的服务 / 热门产品 / CTA（建议用 IntersectionObserver 进入视口后再 `v-if` 挂载）。
- [ ] 合作品牌卡片“mousemove 监听”做成按需启用：
  - 仅在区块进入视口后绑定事件
  - `requestAnimationFrame` 节流（避免每次 mousemove 直接写样式）
  - 在 `onUnmounted` 移除监听（当前是直接 `addEventListener`，没有 cleanup）
- [ ] 可选 CSS 方案（低成本）：为非首屏容器加 `content-visibility: auto; contain-intrinsic-size: ...;`，减少初始布局/绘制压力。

### 图片与媒体（全站）
- [ ] 轮播/大图：首屏只初始化关键逻辑；非首屏轮播/自动播放可以在进入视口后启动（否则后台一直 setInterval）。
- [ ] 现有懒加载是“图片级别”（`LazyPicture`），但 DOM 仍一次性渲染：可把“列表组件”也做成懒挂载（尤其首页合作品牌网格）。

### 路由/模块拆分（可选）
- [ ] 将 `src/views/Products.vue` 也改为路由懒加载（目前 `src/router/index.ts` 里 Products 是同步 import），减少首屏 JS 解析量（注意：首页仍然是首路由，不建议懒加载首页）。

