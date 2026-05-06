import Link from 'next/link';

export const metadata = {
  title: '404 - Signal Lost | Thabo.Portfolio',
};

export default function NotFound() {
  return (
    <main className="error-page">
      <div className="error-background">
        <div className="error-grid"></div>
        <div className="error-glow"></div>
      </div>
      
      <div className="error-content">
        <div className="error-code-wrapper">
          <h1 className="error-code glitch" data-text="404">404</h1>
        </div>
        
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
