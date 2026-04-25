/**
 * ScrollToTop  —  components/ScrollToTop.jsx
 * ============================================
 * Floating action panel fixed to the bottom-right corner of every page.
 * Contains two buttons stacked vertically:
 *
 *   1. Theme Toggle (always visible)
 *      Switches between dark and light mode via the ThemeProvider context.
 *      Icon changes to reflect the current theme (moon = dark, sun = light).
 *
 *   2. Scroll to Top (conditionally visible)
 *      Fades in after the user scrolls more than 300 px from the top.
 *      On click, smoothly scrolls the window back to the top.
 *
 * All layout and transition styles are scoped using <style jsx> to avoid
 * polluting the global stylesheet.
 */
'use client';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function ScrollToTop() {
  const { toggleTheme, theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="floating-actions-container">
      {/* Theme Toggle Button */}
      <div className="floating-btn-wrapper theme-toggle-floating">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Dark/Light Mode">
          {theme === 'light' ? (
            <i className="fas fa-moon"></i>
          ) : (
            <i className="fas fa-sun"></i>
          )}
        </button>
      </div>

      {/* Scroll to Top Button */}
      <div className={`floating-btn-wrapper scroll-to-top ${isVisible ? 'visible' : ''}`}>
        <button onClick={scrollToTop} aria-label="Scroll to top" className="scroll-btn">
          <i className="fas fa-arrow-up"></i>
        </button>
      </div>

      <style jsx>{`
        .floating-actions-container {
          position: fixed;
          bottom: calc(30px + var(--safe-area-inset-bottom, 0px));
          right: 30px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .floating-btn-wrapper {
          opacity: 1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }

        .scroll-to-top {
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
        }

        .scroll-to-top.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        button {
          background: var(--primary-gradient);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 20px var(--accent-glow);
          transition: all 0.3s ease;
          outline: none;
        }

        .theme-toggle-btn {
          background: var(--glass-bg);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
        }

        button:hover {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 8px 25px var(--accent-glow);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .theme-toggle-btn:hover {
          background: var(--accent-color);
          color: white;
        }

        i {
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
        }

        @media (max-width: 768px) {
          .floating-actions-container {
            bottom: 20px;
            right: 20px;
            gap: 10px;
          }
          
          button {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
