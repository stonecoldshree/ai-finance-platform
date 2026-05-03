const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components', 'lib', 'actions', 'hooks', 'emails', 'data'];
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Safe regex to remove full-line comments:
  // 1. Matches lines that only contain whitespace and //
  // 2. Matches lines that only contain whitespace and {/* ... */}
  // 3. We won't try to strip inline comments (e.g. const x = 1; // comment) 
  // because parsing JSX vs strings is error-prone with regex.
  
  const lines = content.split('\n');
  const newLines = [];
  
  let inMultiLine = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // JSX multi-line comment block
    if (trimmed.startsWith('{/*') && !trimmed.endsWith('*/}')) {
      inMultiLine = true;
      continue;
    }
    if (inMultiLine) {
      if (trimmed.endsWith('*/}')) {
        inMultiLine = false;
      }
      continue;
    }

    // Standard JS multi-line comment block
    if (trimmed.startsWith('/*') && !trimmed.endsWith('*/')) {
      inMultiLine = true;
      continue;
    }
    if (inMultiLine) {
      if (trimmed.endsWith('*/')) {
        inMultiLine = false;
      }
      continue;
    }

    // Skip single line full-line comments
    if (trimmed.startsWith('//')) {
      continue;
    }
    if (trimmed.startsWith('{/*') && trimmed.endsWith('*/}')) {
      continue;
    }
    if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
      continue;
    }

    newLines.push(line);
  }

  const newContent = newLines.join('\n');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Cleaned comments from: ${filePath}`);
  }
}

console.log("Starting comment removal...");
for (const dir of targetDirs) {
  const fullDirPath = path.join(__dirname, dir);
  if (fs.existsSync(fullDirPath)) {
    processDirectory(fullDirPath);
  }
}
console.log("Comment removal complete!");
