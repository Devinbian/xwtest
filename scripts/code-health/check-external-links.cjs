const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const scanTargets = [path.join(projectRoot, 'src'), path.join(projectRoot, 'index.html')];

function collectFiles(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (!stat.isDirectory()) return [target];

  const out = [];
  const entries = fs.readdirSync(target, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

const files = scanTargets
  .flatMap((target) => collectFiles(target))
  .filter((file) => /\.(vue|html)$/.test(file));

const issues = [];
const anchorRegex = /<a\b[^>]*\btarget\s*=\s*["']_blank["'][^>]*>/gi;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;

  while ((match = anchorRegex.exec(content)) !== null) {
    const tag = match[0];
    const hasRel = /\brel\s*=\s*["'][^"']*["']/i.test(tag);
    const hasNoopener = /\brel\s*=\s*["'][^"']*\bnoopener\b[^"']*["']/i.test(tag);
    const hasNoreferrer = /\brel\s*=\s*["'][^"']*\bnoreferrer\b[^"']*["']/i.test(tag);

    if (hasRel && hasNoopener && hasNoreferrer) continue;

    issues.push({
      file: path.relative(projectRoot, file),
      line: lineNumberAt(content, match.index),
      tag,
    });
  }
}

if (issues.length === 0) {
  console.log('External link check passed.');
  process.exit(0);
}

console.error('Found external links with target="_blank" missing rel="noopener noreferrer":');
for (const issue of issues) {
  console.error(`- ${issue.file}:${issue.line}`);
  console.error(`  ${issue.tag}`);
}
process.exit(1);
