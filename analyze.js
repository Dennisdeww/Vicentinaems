const fs = require('fs');

const files = [
  'index.html',
  'ems-training.html',
  'en/index.html', 
  'en/ems-training.html',
  'pt/index.html',
  'pt/ems-training.html',
  'de/index.html',
  'de/ems-training.html',
  'fr/index.html',
  'fr/ems-training.html',
  'nl/index.html',
  'nl/ems-training.html',
  'ru/index.html',
  'ru/ems-training.html',
  'uk/index.html',
  'uk/ems-training.html'
];

const directory = 'E:\\github\\vicentinaems\\Vicentinaems';

function extractMeta(html) {
  const metaRegex = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
  const ogTitleRegex = /<meta property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
  const ogDescRegex = /<meta property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
  const ogImageRegex = /<meta property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
  
  let metaDescription = '';
  let ogTitle = '';
  let ogDescription = '';
  let ogImage = '';
  
  let m;
  while ((m = metaRegex.exec(html)) !== null) {
    metaDescription = m[1];
  }
  while ((m = ogTitleRegex.exec(html)) !== null) {
    ogTitle = m[1];
  }
  while ((m = ogDescRegex.exec(html)) !== null) {
    ogDescription = m[1];
  }
  while ((m = ogImageRegex.exec(html)) !== null) {
    ogImage = m[1];
  }
  
  return { metaDescription, ogTitle, ogDescription, ogImage };
}

function extractTitle(html) {
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/i;
  const m = titleRegex.exec(html);
  return m ? m[1] : '';
}

function extractHeadings(html) {
  const headings = [];
  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp('<h[' + i + '][^>]*>([^<]+)</h[' + i + ']>', 'gi');
    let m;
    while ((m = regex.exec(html)) !== null) {
      headings.push({ level: i, text: m[1].trim() });
    }
  }
  return headings;
}

for (const file of files) {
  const path = directory + '\\' + file;
  const html = fs.readFileSync(path, 'utf8');
  
  const { metaDescription, ogTitle, ogDescription, ogImage } = extractMeta(html);
  const title = extractTitle(html);
  const headings = extractHeadings(html);
  
  console.log('=== ' + file + ' ===');
  console.log('Title: ' + title);
  console.log('Meta Description: ' + metaDescription.substring(0, 160));
  console.log('OG Title: ' + ogTitle);
  console.log('OG Description: ' + ogDescription.substring(0, 160));
  console.log('OG Image: ' + ogImage);
  console.log('Headings:', headings.map(h => 'h'.repeat(h.level) + ': ' + h.text).join(' | '));
  console.log('');
}