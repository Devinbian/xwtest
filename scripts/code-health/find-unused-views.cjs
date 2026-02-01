// scripts/find-unused-views.js
const fs = require('fs');
const path = require('path');

// 确保路径正确
const projectRoot = path.resolve(__dirname, '..', '..');
const viewsDir = path.join(projectRoot, 'src/views');
const routerFile = path.join(projectRoot, 'src/router/index.ts'); // 假设路由配置在这里

function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = path.join(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

function findUnusedViews() {
  const viewFiles = getFiles(viewsDir).filter(file => file.endsWith('.vue'));
  const routerContent = fs.readFileSync(routerFile, 'utf-8');

  const unusedViews = [];

  viewFiles.forEach(viewFile => {
    const viewName = path.basename(viewFile, '.vue');
    const isUsed = new RegExp(`\\b${viewName}\\b`, 'g').test(routerContent);

    if (!isUsed) {
      unusedViews.push(viewFile);
    }
  });

  return unusedViews;
}

const unusedViews = findUnusedViews();
if (unusedViews.length > 0) {
  console.log('Unused views:');
  unusedViews.forEach(view => console.log(view));
} else {
  console.log('No unused views found.');
}
