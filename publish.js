const fs = require('fs');
const path = require('path');

// Base directory
const baseDir = __dirname;

// Supported languages (same as in build.js)
const supportedLangs = ['en', 'pt', 'uk', 'ru', 'nl', 'de', 'fr'];

console.log('=== Starting publish process ===\n');

// Create publish directory
const publishDir = path.join(baseDir, 'publish');
if (!fs.existsSync(publishDir)) {
  fs.mkdirSync(publishDir, { recursive: true });
  console.log(`Created publish directory: ${publishDir}`);
}

/**
 * Remove HTML comments from content
 * Handles single-line and multi-line comments
 */
function stripHtmlComments(html) {
  // Remove HTML comments <!-- ... -->
  // Using regex with [\s\S] to match across newlines
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Process all HTML files in a directory recursively
 */
function processHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processHtmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const cleaned = stripHtmlComments(content);
      if (content !== cleaned) {
        fs.writeFileSync(fullPath, cleaned, 'utf8');
        console.log(`  Stripped comments: ${path.relative(publishDir, fullPath)}`);
      }
    }
  }
}

// 1. Copy index.html and ems-training.html from each language folder
console.log('Copying language-specific pages...');
supportedLangs.forEach(lang => {
  const langDir = path.join(baseDir, lang);
  if (!fs.existsSync(langDir)) {
    console.warn(`Language folder not found: ${langDir}, skipping`);
    return;
  }

  const pages = ['index.html', 'ems-training.html'];
  pages.forEach(page => {
    const srcPath = path.join(langDir, page);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(publishDir, `${lang}/${page}`);
      // Ensure destination folder exists
      const destFolder = path.join(publishDir, lang);
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`  Copied: ${lang}/${page}`);
    }
  });
});

// 2. Copy root level index.html and ems-training.html (default English)
console.log('Copying root-level pages...');
const rootPages = ['index.html', 'ems-training.html'];
rootPages.forEach(page => {
  const srcPath = path.join(baseDir, page);
  if (fs.existsSync(srcPath)) {
    const destPath = path.join(publishDir, page);
    fs.copyFileSync(srcPath, destPath);
    console.log(`  Copied: ${page}`);
  }
});

// 3. Copy CSS folder
console.log('Copying CSS assets...');
const cssSrc = path.join(baseDir, 'css');
if (fs.existsSync(cssSrc)) {
  const cssDest = path.join(publishDir, 'css');
  if (!fs.existsSync(cssDest)) {
    fs.mkdirSync(cssDest, { recursive: true });
  }
  // Copy all CSS files
  const cssFiles = fs.readdirSync(cssSrc);
  cssFiles.forEach(file => {
    const src = path.join(cssSrc, file);
    const dest = path.join(cssDest, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
  console.log('  Copied css/ folder');
}

// 4. Copy JS folder
console.log('Copying JS assets...');
const jsSrc = path.join(baseDir, 'js');
if (fs.existsSync(jsSrc)) {
  const jsDest = path.join(publishDir, 'js');
  if (!fs.existsSync(jsDest)) {
    fs.mkdirSync(jsDest, { recursive: true });
  }
  const jsFiles = fs.readdirSync(jsSrc);
  jsFiles.forEach(file => {
    const src = path.join(jsSrc, file);
    const dest = path.join(jsDest, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
  console.log('  Copied js/ folder');
}

// 5. Copy img folder
console.log('Copying image assets...');
const imgSrc = path.join(baseDir, 'img');
if (fs.existsSync(imgSrc)) {
  const imgDest = path.join(publishDir, 'img');
  if (!fs.existsSync(imgDest)) {
    fs.mkdirSync(imgDest, { recursive: true });
  }
  // Copy all files recursively from img
  function copyImgDir(srcDir, destDir) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        copyImgDir(srcPath, destPath);
      } else if (entry.isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  copyImgDir(imgSrc, imgDest);
  console.log('  Copied img/ folder');
}

// 6. Copy resource/translations
console.log('Copying translation resources...');
const resourceSrc = path.join(baseDir, 'resource');
if (fs.existsSync(resourceSrc)) {
  const resourceDest = path.join(publishDir, 'resource');
  if (!fs.existsSync(resourceDest)) {
    fs.mkdirSync(resourceDest, { recursive: true });
  }
  function copyResourceDir(srcDir, destDir) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        copyResourceDir(srcPath, destPath);
      } else if (entry.isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  copyResourceDir(resourceSrc, resourceDest);
  console.log('  Copied resource/ folder');
}

// 7. Copy special files
console.log('Copying special files...');

// googlef702daa065af8336.html - Google verification
const googleVerification = 'googlef702daa065af8336.html';
const googleSrc = path.join(baseDir, googleVerification);
if (fs.existsSync(googleSrc)) {
  fs.copyFileSync(googleSrc, path.join(publishDir, googleVerification));
  console.log(`  Copied: ${googleVerification}`);
} else {
  console.warn(`  WARNING: ${googleVerification} not found in root`);
}

// CNAME file
const cnameFile = 'CNAME';
const cnameSrc = path.join(baseDir, cnameFile);
if (fs.existsSync(cnameSrc)) {
  fs.copyFileSync(cnameSrc, path.join(publishDir, cnameFile));
  console.log(`  Copied: ${cnameFile}`);
} else {
  console.warn(`  WARNING: ${cnameFile} not found in root`);
}

// 8. Copy sitemap.xml
console.log('Copying sitemap...');
const sitemapSrc = path.join(baseDir, 'sitemap.xml');
if (fs.existsSync(sitemapSrc)) {
  fs.copyFileSync(sitemapSrc, path.join(publishDir, 'sitemap.xml'));
  console.log('  Copied: sitemap.xml');
} else {
  console.warn('  WARNING: sitemap.xml not found');
}

// 9. Copy robots.txt
console.log('Copying robots.txt...');
const robotsSrc = path.join(baseDir, 'robots.txt');
if (fs.existsSync(robotsSrc)) {
  fs.copyFileSync(robotsSrc, path.join(publishDir, 'robots.txt'));
  console.log('  Copied: robots.txt');
} else {
  console.warn('  WARNING: robots.txt not found');
}

// 10. Strip HTML comments from all HTML files in publish directory
console.log('\nStripping HTML comments from published files...');
processHtmlFiles(publishDir);

console.log('\n=== Publish process complete ===');
console.log(`\nAll files packaged into: ${publishDir}`);
console.log('Ready for upload to production!');