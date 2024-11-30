const https = require('https');
const fs = require('fs');
const path = require('path');

const owner = 'yuhanbo758';
const repo = 'image';
const branch = 'main'; // 或者是 master，取决于您的默认分支

function fetchGitHubContent(path = '') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}`,
      headers: {
        'User-Agent': 'Node.js',
      },
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function generateImageList() {
  try {
    const contents = await fetchGitHubContent('random');
    const images = contents
      .filter(item => item.type === 'file')
      .map(file => `https://image.sanrenjz.com/random/${file.name}`);

    const outputDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

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