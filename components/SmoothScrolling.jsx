'use client';
import { ReactLenis } from 'lenis/react';

export default function SmoothScrolling({ children }) {
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
