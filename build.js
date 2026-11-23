const fs = require('fs');
const path = require('path');

// Supported languages from translations.json and main.js
const supportedLangs = ['en', 'pt', 'uk', 'ru', 'nl', 'de', 'fr'];

// Source files to translate
const sourceFiles = ['index.html', 'ems-training.html'];

// Base directory
const baseDir = __dirname;

// Load all translations
const translations = {};
supportedLangs.forEach(lang => {
  const translationPath = path.join(baseDir, 'resource', `${lang}.json`);
  if (fs.existsSync(translationPath)) {
    translations[lang] = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
    console.log(`Loaded ${Object.keys(translations[lang]).length} translations for ${lang}`);
  } else {
    console.warn(`Translation file not found: ${translationPath}`);
    translations[lang] = {};
  }
});

/**
 * Translate HTML content using translation keys
 * Handles multiline attributes properly
 */
function translateHtml(html, langTranslations) {
  let result = html;

  for (const [key, val] of Object.entries(langTranslations)) {
    // Escape value for HTML attributes
    const escapedVal = val.replace(/"/g, '"');

    // 1. Meta tag replacement - content attribute (handles multiline)
    // Match: <meta ... data-key="key" ... content="..." ... >
    // Use [\s\S] to match across newlines
    const metaRegex = new RegExp(`(<meta[^>]*data-key="${key}"[^>]*content=")[^"]*(")`, 'gi');
    result = result.replace(metaRegex, `$1${escapedVal}$2`);

    // Also handle meta tags where data-key comes after content
    const metaRegex2 = new RegExp(`(<meta[^>]*content=")[^"]*(")[^>]*data-key="${key}"`, 'gi');
    result = result.replace(metaRegex2, `$1${escapedVal}$2`);

    // 2. Title tag replacement
    const titleRegex = new RegExp(`(<title[^>]*data-key="${key}"[^>]*>)([\\s\\S]*?)(</title>)`, 'gi');
    result = result.replace(titleRegex, `$1${val}$3`);

    // 3. General element replacement - find element with data-key and replace innerHTML
    // This handles <h1 data-key="key">...</h1>, <p data-key="key">...</p>, <span data-key="key">...</span>, etc.
    // We need to be more specific: match opening tag with data-key, then content until matching closing tag
    // Use a more constrained approach - match elements that start with <tag and have data-key
    const elemRegex = new RegExp(`(<([a-z]+\\d?)\\s+[^>]*data-key="${key}"[^>]*>)([\\s\\S]*?)(</\\2>)`, 'gi');
    result = result.replace(elemRegex, `$1${val}$4`);
  }

  return result;
}

/**
 * Update canonical and hreflang URLs for a specific language
 * Uses new subfolder structure: /en/index.html, /pt/index.html, etc.
 */
function updateSeoUrls(html, lang, filename) {
  let result = html;

  // Base URL for the site
  const baseUrl = 'https://ems-alentejo.pt';

  // Language-specific path prefix
  const langPrefix = lang === 'en' ? '' : `/${lang}`;

  // Update canonical URL
  const canonicalRegex = /(<link\s+rel="canonical"\s+href=")[^"]*(")/i;
  result = result.replace(canonicalRegex, `$1${baseUrl}${langPrefix}/${filename}$2`);

  // Update og:url
  const ogUrlRegex = /(<meta\s+property="og:url"\s+content=")[^"]*(")/i;
  result = result.replace(ogUrlRegex, `$1${baseUrl}${langPrefix}/${filename}$2`);

  // Update hreflang links - use new subfolder structure without hashbangs
  supportedLangs.forEach(hreflang => {
    const hreflangPrefix = hreflang === 'en' ? '' : `/${hreflang}`;
    // New structure: /en/index.html, /pt/index.html, etc.
    const hreflangUrl = `${baseUrl}${hreflangPrefix}/${filename}`;
    const xdefaultUrl = `${baseUrl}/${filename}`;

    // Replace existing hreflang links
    const hreflangRegex = new RegExp(`(<link\\s+rel="alternate"\\s+hreflang="${hreflang}"\\s+href=")[^"]*(")`, 'i');
    result = result.replace(hreflangRegex, `$1${hreflangUrl}$2`);
  });

  // Update x-default
  const xDefaultRegex = /(<link\s+rel="alternate"\s+hreflang="x-default"\s+href=")[^"]*(")/i;
  result = result.replace(xDefaultRegex, `$1${baseUrl}/${filename}$2`);

  // Update og:locale
  const localeMap = {
    'en': 'en_US',
    'pt': 'pt_PT',
    'uk': 'uk_UA',
    'ru': 'ru_RU',
    'nl': 'nl_NL',
    'de': 'de_DE',
    'fr': 'fr_FR'
  };
  if (localeMap[lang]) {
    const localeRegex = /(<meta\s+property="og:locale"\s+content=")[^"]*(")/i;
    result = result.replace(localeRegex, `$1${localeMap[lang]}$2`);
  }

  // Update html lang attribute
  const htmlLangRegex = /(<html\s+lang=")[^"]*(")/i;
  result = result.replace(htmlLangRegex, `$1${lang}$2`);

  // Update lang switcher button initial text
  const langBtnRegex = /(<button\s+class="lang-switcher-btn"\s+id="langBtn">)[^<]*(<)/i;
  result = result.replace(langBtnRegex, `$1${lang.toUpperCase()}$2`);

  return result;
}

/**
 * Update root index.html and ems-training.html hreflang links to use subfolder structure
 * This replaces all hashbang links with proper subfolder URLs
 */
function updateRootIndexHreflangs(html) {
  let result = html;

  // Replace all hreflang links from hashbang to subfolder structure
  // Handles both index.html and ems-training.html
  const pages = ['index.html', 'ems-training.html'];
  pages.forEach(page => {
    supportedLangs.forEach(lang => {
      const oldUrl = `https://ems-alentejo.pt/${page}#!${lang}`;
      const newUrl = `https://ems-alentejo.pt/${lang}/${page}`;
      const regex = new RegExp(`href="${oldUrl}"`, 'gi');
      result = result.replace(regex, `href="${newUrl}"`);
    });
  });

  // Update x-default for both pages
  pages.forEach(page => {
    const oldXdefault = `href="https://ems-alentejo.pt/${page}#!en"`;
    const newXdefault = `href="https://ems-alentejo.pt/en/${page}"`;
    result = result.replace(oldXdefault, newXdefault);
  });

  // Update EMS Training link with id "emsTrainingLink"
  // This should point to language-specific ems-training.html URLs
  supportedLangs.forEach(lang => {
    const oldHref = 'href="ems-training.html"';
    const newHref = `href="/${lang}/ems-training.html"`;
    const regex = new RegExp(`(${oldHref})`, 'gi');
    result = result.replace(regex, newHref);
  });

  return result;
}

/**
 * Copy and translate each page to each language folder
 */
sourceFiles.forEach(file => {
  const srcPath = path.join(baseDir, file);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Source file not found: ${srcPath}`);
    return;
  }

  const html = fs.readFileSync(srcPath, 'utf8');

  supportedLangs.forEach(lang => {
    const langDir = path.join(baseDir, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    // Translate content
    let translatedHtml = translateHtml(html, translations[lang]);

    // Update SEO URLs
    translatedHtml = updateSeoUrls(translatedHtml, lang, file);

    // Write to language folder
    const destPath = path.join(langDir, file);
    fs.writeFileSync(destPath, translatedHtml, 'utf8');
    console.log(`Created: ${lang}/${file}`);
  });
});

// Update root index.html hreflang links to use new subfolder structure
// This prevents "Page with redirect" issues in Google Search Console
console.log('Updating root index.html hreflang links...');
const rootIndexPath = path.join(baseDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
  const rootHtml = fs.readFileSync(rootIndexPath, 'utf8');
  const updatedRootHtml = updateRootIndexHreflangs(rootHtml);
  fs.writeFileSync(rootIndexPath, updatedRootHtml, 'utf8');
  console.log('Updated root index.html hreflang links');
}

// Update ems-training.html root hreflang links
const rootEmsPath = path.join(baseDir, 'ems-training.html');
if (fs.existsSync(rootEmsPath)) {
  const rootEmsHtml = fs.readFileSync(rootEmsPath, 'utf8');
  const updatedEmsHtml = updateRootIndexHreflangs(rootEmsHtml);
  fs.writeFileSync(rootEmsPath, updatedEmsHtml, 'utf8');
  console.log('Updated root ems-training.html hreflang links');
}

// Update sitemap.xml with proper URLs
function updateSitemap() {
  const sitemapPath = path.join(baseDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.warn('sitemap.xml not found, skipping sitemap update');
    return;
  }

  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const baseUrl = 'https://ems-alentejo.pt';

  sourceFiles.forEach(file => {
    supportedLangs.forEach(lang => {
      const langPrefix = lang === 'en' ? '' : `/${lang}`;
      const url = `${baseUrl}${langPrefix}/${file}`;

      // Check if this URL already exists in sitemap
      if (!sitemap.includes(`<loc>${url}</loc>`)) {
        // Add new URL entry
        const newUrlEntry = `
  <url>
    <loc>${url}</loc>
${supportedLangs.map(l => {
  const lPrefix = l === 'en' ? '' : `/${l}`;
  return `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}${lPrefix}/${file}#!${l}"/>`;
}).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/${file}#!en"/>
    <lastmod>2024-05-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${file === 'index.html' ? '1.0' : '0.8'}</priority>
  </url>`;
        
        // Insert before closing </urlset>
        sitemap = sitemap.replace('</urlset>', newUrlEntry + '\n</urlset>');
        console.log(`Added to sitemap: ${url}`);
      }
    });
  });

  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Updated sitemap.xml');
}

updateSitemap();

console.log('\nBuild complete!');
console.log('Language folders created with pre-translated HTML files and proper SEO URLs.');