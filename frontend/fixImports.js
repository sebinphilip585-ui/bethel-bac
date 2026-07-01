import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/sebin/bethelll/frontend/src/components/guest';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace("import React\nimport { Link } from 'react-router-dom'; from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
    fs.writeFileSync(filePath, content);
  }
}
