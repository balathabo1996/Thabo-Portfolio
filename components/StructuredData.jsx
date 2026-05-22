/**
 * Schema.org LD+JSON Structured Metadata — components/StructuredData.jsx
 * ======================================================================
 * Renders JSON-LD structured search queries and indexing schemas for
 * search engines (Person and WebSite specifications).
 * Maps dynamic profile data fetched from MongoDB to standard semantic properties.
 */

import React from 'react';

/**
 * StructuredData Component
 * Outputs script tags containing application/ld+json objects for SEO.
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile info containing schema targets
 * @param {string} [props.profile.firstName] - Owner's first name
 * @param {string} [props.profile.lastName] - Owner's last name
 * @param {string} [props.profile.title] - Job Title description string
 * @param {string} [props.profile.profileImageUrl] - Image asset URL mapping
 * @param {string} [props.profile.location] - Geographical location address
 * @returns {React.ReactElement} The JSON-LD schema scripts
 */
export default function StructuredData({ profile = {} }) {
  const {
    firstName = "Thabotharan",
    lastName = "Balachandran",
    title = "Infrastructure Engineer",
    profileImageUrl = "https://res.cloudinary.com/dk4kvk0kw/image/upload/v1/thabo-portfolio/profileImageUrl.png",
    location = "Scarborough, Ontario, Canada"
  } = profile;

  const fullName = `${firstName} ${lastName}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": fullName,
    "url": "https://thabo-portfolio.vercel.app",
    "image": profileImageUrl || "https://res.cloudinary.com/dk4kvk0kw/image/upload/v1/thabo-portfolio/profileImageUrl.png",
    "jobTitle": title,
    "description": `Portfolio of ${fullName}, an experienced Infrastructure Engineer & IT Professional specializing in System Administration and Web Development.`,
    "sameAs": [
      "https://www.linkedin.com/in/balachandran-thabotharan-261895131",
      "https://github.com/balathabo1996"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.split(',')[0].trim(),
      "addressRegion": location.split(',')[1]?.trim(),
      "addressCountry": location.split(',')[2]?.trim() || "Canada"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Thabo.Projects",
    "url": "https://thabo-portfolio.vercel.app",
    "description": `Professional Portfolio of ${fullName}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
