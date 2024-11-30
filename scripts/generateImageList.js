const fs = require('fs');
const path = require('path');

async function generateImageList() {
  try {
    // 图片目录路径
    const imageDir = path.join(process.cwd(), 'ramdom');
    
    // 读取目录中的所有文件
    const files = fs.readdirSync(imageDir);
    
    // 过滤图片文件并生成URL列表
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => `https://image.sanrenjz.com/ramdom/${file}`);

    // 确保public目录存在
    const outputDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入图片列表
    fs.writeFileSync(
      path.join(outputDir, 'imageList.json'),
      JSON.stringify(images, null, 2)
    );

    console.log(`Generated image list with ${images.length} images`);
  } catch (error) {
    console.error('Error generating image list:', error);
    process.exit(1);
  }
}

generateImageList(); 