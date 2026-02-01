src
--data
----home
------productCategories.js    首页，主营产品板块数据源
------industries.js           首页，八大行业板块数据源
------services.js             首页，我们的服务板块数据源
------partners.js             首页、关于我们页面，合作品牌板块的数据源
------top10Products.js        首页，热门产品板块数据源

----navigation
------menuForNewProds.js      主导航，产品菜单数据源，目前维护了3个品牌的数据，每个品牌提供2个产品

----products
------products.js             产品页面，产品的数据源
------categories.js           产品页面，左侧菜单数据源


scripts
--images
----generate-thumbnails.cjs   生成缩略图，遍历 images 下的所有图片，生成缩略图，方便加载显示
----process_img800x800.*      图片批处理脚本（Windows）
--code-health
----find-unused-components.cjs  查找未使用的组件（粗略扫描）
----find-unused-views.cjs       查找未使用的页面（粗略扫描）

## 开发环境
- Node：建议使用 nvm，并执行 `nvm use`（版本见 `.nvmrc`）
- 启动：`npm install`，然后 `npm run dev`


# 产品卡片右上角的角标，在Products.vue中定义的函数
//角标的标签内容对应products.js中的condition字段
const getConditionText = (condition: string) => {
  const conditionMap = {
    new: '全新',
    used: '二手',
    refurbished: '翻新',
    sale:'促销',
    discount:'50%'
  } as const;
  return conditionMap[condition as keyof typeof conditionMap] || '未知';
};
