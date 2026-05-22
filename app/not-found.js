/**
 * Custom 404 Error Page — app/not-found.js
 * =========================================
 * Displays an elegant, stylized "Signal Lost / Reboot System" cyberpunk error page
 * when a user navigates to an invalid route. Includes dynamic visual effects like 
 * grid overlaps, glow layouts, text glitch styling, and clean Bootstrap actions.
 */

import Link from 'next/link';

/**
 * Metadata configuration for the NotFound error page.
 * Maximizes SEO safety by providing an explicit descriptive title.
 */
export const metadata = {
  title: '404 - Signal Lost | Thabo.Portfolio',
};

/**
 * NotFound Component
 * Renders the glitch-styled error layout with redirect links back to
 * home and support channels.
 */
export default function NotFound() {
  return (
    <main className="error-page">
      {/* Decorative background grid and neon glow elements */}
      <div className="error-background">
        <div className="error-grid"></div>
        <div className="error-glow"></div>
      </div>
      
      {/* Primary error content box */}
      <div className="error-content">
        {/* Animated glitch text displaying 404 */}
        <div className="error-code-wrapper">
          <h1 className="error-code glitch" data-text="404">404</h1>
        </div>
        
        {/* Status badge and access descriptions */}
        <div className="error-message">
          <div className="status-badge">
            <span className="status-dot"></span>
            CONNECTION LOST
          </div>
          <h2>Access Denied</h2>
          <p>
            The sector you are trying to reach does not exist or has been moved 
            to a secure, off-grid location.
          </p>
        </div>

        {/* CTA links to reboot (go home) or report incidents (open contact form) */}
        <div className="error-actions">
          <Link href="/" className="btn-error">
            <i className="fas fa-terminal me-2"></i>
            REBOOT SYSTEM
          </Link>
          <a href="/#contact" className="btn-error outline">
            <i className="fas fa-headset me-2"></i>
            REPORT INCIDENT
          </a>
        </div>
      </div>
    </main>
  );
}

