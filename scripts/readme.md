generate-thumbnails.cjs 这个脚本会：
--扫描 public/images 目录下的所有图片
--为每个图片生成一个低质量的预览版本（添加 -small 后缀）
--预览图会被调整大小、轻微模糊化和压缩
使用方法：
--确保 public/images 目录存在并包含原始图片
--运行命令：
---npm run generate-thumbnails
