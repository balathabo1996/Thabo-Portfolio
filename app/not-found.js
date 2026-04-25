/**
 * 404 Not Found Page  —  app/not-found.js
 * =========================================
 * Rendered automatically by Next.js whenever a requested route cannot be matched.
 * Displays a full-screen "Signal Lost" screen featuring:
 *   - An animated gradient "404" numeral with a glow/pulse effect
 *   - A satellite-dish icon with a floating animation
 *   - A short flavour-text description of the error
 *   - A "Return to Base" button that navigates back to the home page
 */
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Thabo.Portfolio',
  icons: {
    icon: 'https://img.icons8.com/ios-filled/50/000000/error.png',
    shortcut: 'https://img.icons8.com/ios-filled/50/000000/error.png',
  },
};

export default function NotFound() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, transparent 0%, var(--bg-body) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <main
        className="container error-container"
        style={{
          textAlign: 'center',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: '12rem',
            lineHeight: '0.8',
            fontWeight: '800',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 0 40px rgba(0, 198, 255, 0.3))',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        >
          404
        </div>

        <h2
          style={{
            fontSize: '3rem',
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
            fontWeight: '700',
            letterSpacing: '-1px',
            textTransform: 'uppercase',
          }}
        >
          <i
            className="fas fa-satellite-dish"
            style={{
              color: 'var(--accent-color)',
              marginRight: '20px',
              animation: 'float 6s ease-in-out infinite',
            }}
          ></i>
          Signal Lost
        </h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            marginBottom: '3rem',
            maxWidth: '600px',
            fontSize: '1.2rem',
            lineHeight: '1.8',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '20px 0',
          }}
        >
          We couldn&apos;t establish a connection to the requested sector.
          <br />
          The coordinates might be scrambled, or the system is temporarily offline.
        </p>

        <Link
          href="/"
          className="btn-submit"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'auto',
            minWidth: '240px',
            padding: '16px 40px',
            borderRadius: '50px',
            boxShadow: '0 0 20px rgba(0, 198, 255, 0.2)',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            background: 'var(--primary-gradient)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <i className="fas fa-undo" style={{ marginRight: '12px' }}></i>
          Return to Base
        </Link>
      </main>
    </>
  );
}
