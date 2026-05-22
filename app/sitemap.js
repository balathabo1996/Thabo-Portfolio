/**
 * SEO Sitemap Generator — app/sitemap.js
 * =======================================
 * Generates the sitemap.xml dynamically at build or runtime.
 * Informs search engines about the indexable pages of Balachandran Thabotharan's
 * portfolio, their update frequency, and their crawling priority hierarchy.
 */

/**
 * Generates a collection of page mappings for indexers.
 * 
 * @returns {import("next").MetadataRoute.Sitemap} Array of sitemap URL descriptions
 */
export default function sitemap() {
  return [
    {
      // Main public landing page of the portfolio
      url: 'https://thabo-portfolio.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // Maximum indexing focus priority
    },
    {
      // Direct access link to download the PDF resume document
      url: 'https://thabo-portfolio.vercel.app/resume.pdf',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // Secondary index priority
    },
  ]
}

