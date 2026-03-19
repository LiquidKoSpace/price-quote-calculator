import { mockBrands } from './mockData';

/**
 * Generates a sitemap XML string from the brand data
 * @returns XML sitemap string
 */
export function generateSitemap(): string {
    const baseUrl = 'https://liquidkospace.co.za';
    const currentDate = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
        { url: '', priority: '1.0', changefreq: 'weekly' }, // Home
        { url: '/brands', priority: '0.9', changefreq: 'daily' }, // Brands listing
        { url: '/about', priority: '0.7', changefreq: 'monthly' },
        { url: '/for-brands', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    // Generate brand pages dynamically
    const brandPages = mockBrands.map(brand => ({
        url: `/brands/${brand.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
    }));

    const allPages = [...staticPages, ...brandPages];

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    allPages.forEach(page => {
        xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    return xml;
}

/**
 * Get all brand slugs for sitemap generation
 * @returns Array of brand slugs
 */
export function getAllBrandSlugs(): string[] {
    return mockBrands.map(brand => brand.slug);
}
