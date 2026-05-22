/**
 * Dynamic OpenGraph Cover Card Generator — app/opengraph-image.jsx
 * =================================================================
 * Generates the OpenGraph cover image dynamically on the fly using Next.js ImageResponse.
 * Runs in the Vercel Edge Runtime to ensure ultra-fast load times when the portfolio
 * link is shared across social media networks (LinkedIn, Slack, WhatsApp, Twitter, etc.).
 */

import { ImageResponse } from 'next/og';

// Force Edge Runtime execution for optimal dynamic rendering performance
export const runtime = 'edge';

// Descriptive accessibility text for the social preview card image
export const alt = 'Thabotharan Balachandran Portfolio';

// Resolution dimensions for standard high-definition social image previews
export const size = {
  width: 1200,
  height: 630,
};

// Response MIME type format
export const contentType = 'image/png';

/**
 * Default OpenGraph image generator function.
 * Builds an HTML/CSS layout using inline flexbox styles which ImageResponse
 * compiles down to an optimized PNG file.
 * 
 * @returns {ImageResponse} Standard HTTP image response
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
          border: '20px solid #00c6ff', // Bright electric blue boundary frame
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Main heading displaying owner name in standard linear neon gradient */}
          <h1
            style={{
              fontSize: '80px',
              fontWeight: '900',
              marginBottom: '20px',
              background: 'linear-gradient(to right, #00c6ff, #0072ff)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Thabotharan Balachandran
          </h1>
          {/* Tagline showing professional specialties */}
          <p
            style={{
              fontSize: '40px',
              color: '#a0a0a0',
              maxWidth: '800px',
              lineHeight: '1.4',
            }}
          >
            Infrastructure Engineer | IT Solutions | Cybersecurity Enthusiast
          </p>
        </div>

        {/* Dynamic bottom branding details with website url and email */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            gap: '30px',
            fontSize: '24px',
            color: '#00c6ff',
          }}
        >
          <span>🌐 thabo-portfolio.vercel.app</span>
          <span>📧 balathabo96@gmail.com</span>
        </div>
      </div>
    ),
    {
      // Apply configured sizing dimensions
      ...size,
    }
  );
}

