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
          if (file.endsWith('.html') || file.endsWith('.php') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.toLowerCase().includes('kataragama') || content.toLowerCase().includes('bungalow') || content.toLowerCase().includes('booking')) {
              console.log(`Found: ${fullPath} (${content.length} bytes)`);
            }
          }
        }
      } catch (err) {}
    });
  } catch (err) {}
}

walk('d:\\Developments');
