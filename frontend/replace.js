import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/lib/supabase')) {
        content = content.replace(/\/lib\/supabase/g, '/lib/api');
        
        // Remove 'supabase' export from DataContext if present
        if (fullPath.includes('DataContext.jsx')) {
          content = content.replace(', supabase,', ',');
        }
        
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

// Rename the file
const oldPath = path.join(__dirname, 'src/lib/supabase.js');
const newPath = path.join(__dirname, 'src/lib/api.js');
if (fs.existsSync(oldPath)) {
  let content = fs.readFileSync(oldPath, 'utf8');
  content = content.replace(/export const supabase = null;\n?/g, '');
  fs.writeFileSync(newPath, content);
  fs.unlinkSync(oldPath);
  console.log('Renamed supabase.js to api.js');
}

replaceInDir(path.join(__dirname, 'src'));
