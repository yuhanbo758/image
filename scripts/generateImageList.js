const fs = require('fs');
const path = require('path');

// 指定图片目录的路径（相对于项目根目录）
const imageDir = path.join(process.cwd(), 'public', 'random');

// 读取目录中的文件
const files = fs.readdirSync(imageDir)
  .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

// 生成文件列表
const fileContent = `export const imageFiles = ${JSON.stringify(files, null, 2)};`;

// 写入文件
fs.writeFileSync(
  path.join(process.cwd(), 'data', 'imageList.js'),
  fileContent
);

console.log('Image list generated successfully!'); 