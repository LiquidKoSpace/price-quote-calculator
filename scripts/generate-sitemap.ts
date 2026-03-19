import { generateSitemap } from '../src/lib/sitemap';
import * as fs from 'fs';
import * as path from 'path';

// Generate sitemap and write to public directory
const sitemapXml = generateSitemap();
const outputPath = path.join(__dirname, '../public/sitemap.xml');

fs.writeFileSync(outputPath, sitemapXml, 'utf-8');

console.log('✅ Sitemap generated successfully at:', outputPath);
console.log(`📊 Total URLs: ${sitemapXml.split('<url>').length - 1}`);
