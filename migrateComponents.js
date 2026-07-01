import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/sebin/bethelll/luxury-frontend/src/components';
const destDir = 'c:/Users/sebin/bethelll/frontend/src/components/guest';

// Create destination dir if not exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Files to copy
const files = [
  'Hero.jsx',
  'AboutSection.jsx',
  'ApartmentsShowcase.jsx',
  'Facilities.jsx',
  'WhyChooseUs.jsx',
  'Gallery.jsx',
  'Attractions.jsx',
  'Reviews.jsx'
];

for (const file of files) {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf-8');
    
    // We need to fix the Book Now buttons to use <Link> to /booking
    // First import Link if not present
    if (!content.includes("import { Link } from 'react-router-dom';") && !content.includes("import { motion } from 'framer-motion';")) {
      content = "import { Link } from 'react-router-dom';\n" + content;
    } else if (!content.includes("import { Link } from 'react-router-dom';")) {
      content = content.replace("import React", "import React\nimport { Link } from 'react-router-dom';");
    }

    // Replace <a href="#book"> or similar with <Link to="/booking">
    content = content.replace(/<a href="#book"([^>]*)>(.*?)<\/a>/g, '<Link to="/booking"$1>$2</Link>');
    
    fs.writeFileSync(destPath, content);
    console.log(`Copied and patched ${file}`);
  } else {
    console.log(`Skipped ${file} - not found in source`);
  }
}
