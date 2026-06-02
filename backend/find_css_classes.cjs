const fs = require('fs');
const path = require('path');

function walk(dir) {
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (file !== 'node_modules' && file !== 'vendor' && file !== '.git') {
            walk(fullPath);
          }
        } else {
          // Read all text files (excluding binary formats)
          if (!file.endsWith('.png') && !file.endsWith('.jpg') && !file.endsWith('.pdf') && !file.endsWith('.zip') && !file.endsWith('.exe')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('bk-hero') || content.includes('Deluxe') || content.includes('Circuit Bungalow')) {
              console.log(`Found matching content: ${fullPath} (${content.length} bytes)`);
            }
          }
        }
      } catch (err) {}
    });
  } catch (err) {}
}

walk('d:\\Developments');
