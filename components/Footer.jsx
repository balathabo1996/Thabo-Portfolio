/**
 * Footer  —  components/Footer.jsx
 * ==================================
 * Site-wide footer rendered on every page through the Root Layout.
 * Contains social / contact icon links populated from MongoDB.
 */
'use client';
import { usePathname } from 'next/navigation';

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
      <p>&copy; {currentYear} {fullName}. All rights reserved.</p>
    </footer>
  );
}
