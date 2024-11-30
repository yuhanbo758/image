import https from 'https';

export default function handler(req, res) {
  try {
    // 使用 GitHub API 获取仓库内容
    const options = {
      hostname: 'api.github.com',
      path: '/repos/yuhanbo758/image/contents/random',
      headers: {
        'User-Agent': 'Random-Image-API',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    console.log('Fetching images from GitHub API...');
    const request = https.get(options, (response) => {
      let data = '';
      
      // 检查响应状态
      if (response.statusCode !== 200) {
        console.error('GitHub API Response Status:', response.statusCode);
        return res.status(response.statusCode).json({
          error: 'GitHub API error',
          status: response.statusCode,
          message: response.statusMessage
        });
      }
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          console.log('Parsing GitHub API response...');
          const files = JSON.parse(data);
          
          // 过滤图片文件
          const imageFiles = files.filter(file => {
            const isImage = file.name.toLowerCase().endsWith('.jpg') || 
                          file.name.toLowerCase().endsWith('.png') || 
                          file.name.toLowerCase().endsWith('.gif') || 
                          file.name.toLowerCase().endsWith('.jpeg');
            return isImage;
          });

          console.log(`Found ${imageFiles.length} images`);

          if (imageFiles.length === 0) {
            console.error('No images found in response');
            throw new Error('No images found in the repository');
          }

          // 随机选择一张图片
          const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
          const imageUrl = `https://image.sanrenjz.com/random/${randomImage.name}`;
          
          console.log('Selected image:', imageUrl);
          
          // 设置缓存控制头
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          
          // 设置 CORS 头
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET');
          
          res.redirect(307, imageUrl);
        } catch (error) {
          console.error('Error parsing response:', error);
          console.error('Raw response data:', data);
          res.status(500).json({ 
            error: 'Failed to parse repository contents',
            details: error.message,
            data: data.substring(0, 200) // 只返回前200个字符避免响应过大
          });
        }
      });
    });

    // 设置请求超时
    request.setTimeout(5000, () => {
      request.destroy();
      console.error('Request timeout');
      res.status(504).json({ error: 'Request timeout' });
    });

    request.on('error', (error) => {
      console.error('Error fetching from GitHub:', error);
      res.status(500).json({ 
        error: 'Failed to fetch repository contents',
        details: error.message 
      });
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get random image',
      details: error.message 
    });
  }
} 