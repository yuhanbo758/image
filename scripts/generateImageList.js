const https = require('https');
const fs = require('fs');
const path = require('path');

const owner = 'yuhanbo758';
const repo = 'image';

function fetchGitHubContent() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/ramdom`,
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json',
      },
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(jsonData);
          } else {
            reject(new Error(`GitHub API returned status ${res.statusCode}: ${jsonData.message}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function generateImageList() {
  try {
    const contents = await fetchGitHubContent();
    const images = contents
      .filter(item => item.type === 'file')
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file.name))
      .map(file => `https://raw.githubusercontent.com/${owner}/${repo}/main/ramdom/${file.name}`);

    const outputDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
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