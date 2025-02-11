import fs from 'fs/promises'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
import { createWriteStream, unlink } from 'fs'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 定义颜色代码
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
}

// 需要创建的目录
const directories = [
  'src/assets/images/logo',
  'src/assets/images/brands/keysight/products',
  'src/assets/images/brands/tektronix/products',
  'src/assets/images/brands/fluke/products',
  'src/assets/images/hero',
  'src/assets/images/backgrounds',
  'src/assets/videos',
  'src/assets/icons/menu',
  'src/assets/icons/social'
].map(dir => path.resolve(__dirname, '..', dir))

// 需要下载的图片
const images = {
  // Hero 图片
  'src/assets/images/hero/home-hero.jpg': 'https://picsum.photos/1920/1080',
  'src/assets/images/hero/products-hero.jpg': 'https://picsum.photos/1920/1080',
  'src/assets/images/hero/about-hero.jpg': 'https://picsum.photos/1920/1080',
  
  // 产品图片
  'src/assets/images/brands/keysight/products/e36312a.png': 'https://placehold.co/800x600/png?text=E36312A+Power+Supply',
  'src/assets/images/brands/keysight/products/banner.jpg': 'https://placehold.co/1200x400/jpg?text=Keysight+Banner',
  'src/assets/images/brands/tektronix/products/mso46.png': 'https://placehold.co/800x600/png?text=MSO46+Oscilloscope',
  'src/assets/images/brands/tektronix/products/tbs2000b.png': 'https://placehold.co/800x600/png?text=TBS2000B+Oscilloscope',
  'src/assets/images/brands/fluke/products/87v.png': 'https://placehold.co/800x600/png?text=Fluke+87V+Multimeter'
}

// 转换图片路径为绝对路径
const absoluteImages = Object.entries(images).reduce((acc, [key, value]) => {
  acc[path.resolve(__dirname, '..', key)] = value
  return acc
}, {})

// 下载文件函数
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
        return
      }

      const fileStream = createWriteStream(filePath)
      response.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        resolve()
      })

      fileStream.on('error', err => {
        unlink(filePath, () => {})
        reject(err)
      })
    }).on('error', reject)
  })
}

// 创建目录
async function createDirectories() {
  console.log('✨ 开始创建资源目录...\n')
  
  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true })
      console.log(`${colors.green}✓${colors.reset} 创建目录: ${dir}`)
    } catch (err) {
      console.error(`${colors.red}✗${colors.reset} 创建目录失败: ${dir}`, err)
    }
  }
}

// 下载图片
async function downloadImages() {
  console.log('\n📥 开始下载图片...\n')
  
  for (const [filePath, url] of Object.entries(absoluteImages)) {
    try {
      await downloadFile(url, filePath)
      console.log(`${colors.green}✓${colors.reset} 下载成功: ${path.relative(__dirname, filePath)}`)
    } catch (err) {
      console.error(`${colors.red}✗${colors.reset} 下载失败: ${path.relative(__dirname, filePath)}`, err)
    }
  }
}

// 检查文件完整性
async function checkFiles() {
  console.log('\n🔍 检查文件完整性...\n')
  
  for (const filePath of Object.keys(absoluteImages)) {
    try {
      await fs.access(filePath)
      console.log(`${colors.green}✓${colors.reset} 文件存在: ${path.relative(__dirname, filePath)}`)
    } catch {
      console.log(`${colors.red}✗${colors.reset} 文件不存在: ${path.relative(__dirname, filePath)}`)
    }
  }
}

// 主函数
async function main() {
  try {
    await createDirectories()
    await downloadImages()
    await checkFiles()
    console.log(`\n${colors.blue}🎉 资源生成完成！${colors.reset}`)
  } catch (err) {
    console.error(`\n${colors.red}错误:${colors.reset}`, err)
    process.exit(1)
  }
}

// 运行脚本
main() 