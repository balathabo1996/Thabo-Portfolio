/**
 * Viewport Scroll Progress Bar — components/ScrollProgressBar.jsx
 * ==============================================================
 * Renders a fixed 3px gradient progress line at the very top edge
 * of the viewport that fills horizontally as the user scrolls.
 */

'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progressPercent = Math.min(Math.max(currentScroll / scrollTotal, 0), 1);
      setProgress(progressPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="scroll-progress-line"
      style={{
        transform: `scaleX(${progress})`,
      }}
      aria-hidden="true"
    />
  );
}

