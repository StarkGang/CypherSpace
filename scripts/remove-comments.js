const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const srcDir = path.join(__dirname, '../src');
const files = walkSync(srcDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const stripped = strip(content);
  const cleaned = stripped.replace(/\n\s*\n\s*\n/g, '\n\n');
  if (content !== cleaned) {
    fs.writeFileSync(file, cleaned, 'utf8');
    console.log(`Stripped comments from ${file}`);
  }
});
console.log('Done stripping comments.');
