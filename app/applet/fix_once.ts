import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('src/data');
const files = fs.readdirSync(dataDir);

let totalReplaced = 0;

for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  let modified = content;
  
  // Replace 'Once live, ' or 'Once live ' in descriptions / howTo steps
  // e.g. 'Once live, enter...' -> 'Enter...'
  modified = modified.replace(/(['"`])Once live,\s+([a-z])/g, (m, quote, p1) => {
    totalReplaced++;
    return quote + p1.toUpperCase();
  });
  modified = modified.replace(/(['"`])Once live\s+([a-z])/g, (m, quote, p1) => {
    totalReplaced++;
    return quote + p1.toUpperCase();
  });
  
  if (modified !== content) {
    fs.writeFileSync(filePath, modified, 'utf-8');
    console.log(`Updated ${file}`);
  }
}

console.log(`Total 'Once live' occurrences updated: ${totalReplaced}`);
