import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const imageListPath = path.join(process.cwd(), 'public', 'imageList.json');
    const images = JSON.parse(fs.readFileSync(imageListPath, 'utf8'));
    
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    // 设置 CORS 头，允许从任何域名访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // 返回随机图片 URL
    if (req.query.json === 'true') {
      res.status(200).json({ url: randomImage });
    } else {
      res.redirect(307, randomImage);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get random image' });
  }
} 