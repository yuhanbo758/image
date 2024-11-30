export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  try {
    // 获取目录列表
    const response = await fetch('https://image.sanrenjz.com/random/');
    const text = await response.text();
    
    // 解析HTML获取文件列表
    const files = text.match(/href="([^"]+\.(jpg|jpeg|png|gif))"/gi)
      ?.map(href => href.match(/href="([^"]+)"/)[1])
      ?.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)) || [];

    if (files.length === 0) {
      throw new Error('No images found');
    }

    // 随机选择一张图片
    const randomImage = files[Math.floor(Math.random() * files.length)];
    const imageUrl = `https://image.sanrenjz.com/random/${randomImage}`;

    // 返回响应
    return new Response(
      JSON.stringify({
        url: imageUrl,
        status: 'success'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to get random image',
        details: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 