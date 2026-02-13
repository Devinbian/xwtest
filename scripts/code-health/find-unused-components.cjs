// scripts/find-unused-components.js
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const componentsDir = path.join(projectRoot, 'src/components');
const srcDir = path.join(projectRoot, 'src');

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

function findUnusedComponents() {
  const componentFiles = getFiles(componentsDir).filter(file => file.endsWith('.vue'));
  const allFiles = getFiles(srcDir).filter(file => file.endsWith('.vue') || file.endsWith('.js') || file.endsWith('.ts'));

  const unusedComponents = [];

  componentFiles.forEach(componentFile => {
    const componentName = path.basename(componentFile, '.vue');
    const isUsed = allFiles.some(file => {
      if (path.resolve(file) === path.resolve(componentFile)) {
        return false;
      }
      const content = fs.readFileSync(file, 'utf-8');
      const regex = new RegExp(`\\b${componentName}\\b`, 'g');
      return regex.test(content);
    });

    if (!isUsed) {
      unusedComponents.push(componentFile);
    }
  });

  return unusedComponents;
}

const unusedComponents = findUnusedComponents();
if (unusedComponents.length > 0) {
  console.log('Unused components:');
  unusedComponents.forEach(component => console.log(component));
  process.exit(1);
} else {
  console.log('No unused components found.');
}
