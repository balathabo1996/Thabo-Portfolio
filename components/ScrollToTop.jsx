/**
 * Sticky Scroll-To-Top Navigation Shortcut — components/ScrollToTop.jsx
 * ===================================================================
 * Client component that triggers a floating button when the user scrolls past
 * 300 vertical pixels. Clicking the action smooth scrolls back to the top
 * of the document and clears/resets the browser hash location path.
 */

'use client';
import { useState, useEffect } from 'react';

/**
 * ScrollToTop Component
 * Sticky circular scroll shortcut mapping user viewport coordinates to trigger visibility.
 *
 * @returns {React.ReactElement} The circular arrow button container
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    // Scroll to absolute top of the document
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    
    // Update hash to home to keep it consistent with the navigation
    if (window.history.pushState) {
        window.history.pushState(null, null, '/#home');
    }
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="fas fa-chevron-up"></i>
    </button>
  );
}
