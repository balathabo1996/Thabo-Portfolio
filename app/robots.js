/**
 * Search Crawler Rules — app/robots.js
 * =====================================
 * Generates the robots.txt endpoint dynamically for the application.
 * Instructs standard search engine indexers (like Googlebot) on what paths
 * they are authorized to crawl and lists the absolute sitemap URI.
 */

/**
 * Returns crawling instructions conforming to the robots.txt specification.
 * Allow-lists all public routes while disallowing standard backend API routing folders.
 * 
 * @returns {import("next").MetadataRoute.Robots} Robots specification configuration object
 */
export default function robots() {
  return {
    rules: {
      userAgent: '*',     // Target all search indexers and web crawlers
      allow: '/',         // Allow indexing of all public portfolio directories
      disallow: ['/api/'], // Block search engine crawlers from scraping backend api routes
    },
    // The absolute URI mapping our sitemap index XML
    sitemap: 'https://thabo-portfolio.vercel.app/sitemap.xml',
  }
}

