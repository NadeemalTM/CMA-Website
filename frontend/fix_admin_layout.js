import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src/pages/admin');
const files = fs.readdirSync(dir);

let modifiedCount = 0;

for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes('<AdminLayout')) {
      // Just replace the tags! Leave imports/definitions alone to avoid syntax errors.
      content = content.replace(/<AdminLayout[^>]*>/g, '<div className="admin-page-content" style={{ padding: "0.5rem" }}>');
      content = content.replace(/<\/AdminLayout>/g, '</div>');

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Fixed tags in', file);
      modifiedCount++;
    }
  }
}

console.log('Total fixed:', modifiedCount);
