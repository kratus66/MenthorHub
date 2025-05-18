// copy-seeds.js
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'src', 'seeder');
const destDir = path.join(__dirname, 'dist', 'seeder');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = [
  'categories-with-uuid.json',
  'professors-with-uuid.json',
  'classes-generated.json'
];

filesToCopy.forEach((file) => {
  const srcPath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copiado: ${file}`);
  } else {
    console.warn(`⚠️ No se encontró: ${file}`);
  }
});

