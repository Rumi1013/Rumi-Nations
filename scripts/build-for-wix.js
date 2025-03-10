const fs = require('fs');
const path = require('path');

// Directories to process
const directories = {
  components: path.join(__dirname, '../src/components'),
  pages: path.join(__dirname, '../src/pages'),
  public: path.join(__dirname, '../public'),
  backend: path.join(__dirname, '../backend')
};

// Create Wix directories if they don't exist
Object.keys(directories).forEach(dir => {
  const wixDir = path.join(__dirname, '../.wix', dir);
  if (!fs.existsSync(wixDir)) {
    fs.mkdirSync(wixDir, { recursive: true });
  }
});

// Copy files to Wix directory
function copyFiles(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) return;
  
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyFiles(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Process each directory
Object.entries(directories).forEach(([name, dir]) => {
  const wixDir = path.join(__dirname, '../.wix', name);
  copyFiles(dir, wixDir);
});

console.log('Files prepared for Wix deployment');
