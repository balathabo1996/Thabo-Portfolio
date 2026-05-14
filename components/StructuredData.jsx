import React from 'react';

export default function StructuredData({ profile = {} }) {
  const {
    firstName = "Thabotharan",
    lastName = "Balachandran",
    title = "Infrastructure Engineer",
    profileImageUrl = "/images/portf.png",
    location = "Scarborough, Ontario, Canada"
  } = profile;

  const fullName = `${firstName} ${lastName}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": fullName,
    "url": "https://thabo-portfolio.vercel.app",
    "image": profileImageUrl || "https://thabo-portfolio.vercel.app/images/portf.png",
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
