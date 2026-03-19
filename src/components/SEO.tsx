import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'product';
    keywords?: string;
    structuredData?: object;
}

/**
 * SEO component for managing page-specific meta tags
 * Provides comprehensive SEO optimization including Open Graph, Twitter Cards, and structured data
 */
export function SEO({
    title,
    description,
    canonical,
    ogImage = 'https://liquidkospace.co.za/logo-black.png',
    ogType = 'website',
    keywords,
    structuredData,
}: SEOProps) {
    const fullTitle = `${title} | Liquid Ko Space`;
    const baseUrl = 'https://liquidkospace.co.za';
    const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Liquid Ko Space" />
            <meta property="og:locale" content="en_ZA" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
}
