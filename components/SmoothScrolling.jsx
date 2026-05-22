/**
 * Inertial Smooth Scrolling Wrapper — components/SmoothScrolling.jsx
 * =================================================================
 * Client component that integrates Lenis smooth scroll features across the site.
 * Keeps standard browser scrolling in dashboard directories (`/admin`) to avoid
 * breaking administrative layout interactions.
 */

'use client';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

/**
 * SmoothScrolling Component
 * Instantiates the Lenis scrolling container.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements that inherit the smooth scroll effect
 * @returns {React.ReactElement} The Lenis scroll container or fallback React Fragment
 */
export default function SmoothScrolling({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin';

  if (isAdmin) return <>{children}</>;

  return (
    <ReactLenis root options={{ 
      lerp: 0.08, 
      duration: 1.2, 
      smoothTouch: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    }}>
      {children}
    </ReactLenis>
  );
}
