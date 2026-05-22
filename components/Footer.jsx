/**
 * Footer  —  components/Footer.jsx
 * ==================================
 * Site-wide footer rendered on every page through the Root Layout.
 * Contains social / contact icon links populated from MongoDB.
 */
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/**
 * Footer Component
 * Renders the global footer elements including copyright, links, and social items.
 * Suppressed when rendering the admin panel layout.
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile info containing social URLs
 * @param {string} [props.profile.email] - Contact email address
 * @param {string} [props.profile.linkedinUrl] - LinkedIn profile URL
 * @param {string} [props.profile.githubUrl] - GitHub profile URL
 * @param {string} [props.profile.firstName] - Owner's first name
 * @param {string} [props.profile.lastName] - Owner's last name
 * @returns {React.ReactElement|null} The styled footer or null if in admin view
 */
export default function Footer({ profile = {} }) {
  const pathname = usePathname();
  if (pathname === '/admin') return null;

  const currentYear = new Date().getFullYear();
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Thabotharan Balachandran';

  return (
    <footer>
      <div className="social-links">
        {profile.email && (
          <a href={`mailto:${profile.email}`} aria-label="Email">
            <i className="fas fa-envelope"></i>
          </a>
        )}
        {profile.linkedinUrl && (
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        )}
        {profile.githubUrl && (
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
        )}
      </div>
      <p>
        <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
          &copy;
        </Link>{' '}
        {currentYear} {fullName}. All rights reserved
        <Link href="/api-docs" style={{ color: 'inherit', textDecoration: 'none' }}>
          .
        </Link>
      </p>
    </footer>
  );
}
