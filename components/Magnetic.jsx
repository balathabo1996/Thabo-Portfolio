/**
 * Magnetic Wrapper Component — components/Magnetic.jsx
 * ====================================================
 * An interactive wrapper component that pulls nested content towards the user's cursor
 * using Framer Motion spring physics. Ideal for interactive icons, badges, and CTA links.
 */

'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Magnetic Component
 * Applies cursor attraction logic to its children.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component node elements to apply the magnetic effect on
 * @param {number} [props.strength=0.2] - Force modifier that adjusts mouse-pull offset (higher = stronger attraction)
 * @returns {React.ReactElement} The framer-motion wrap segment
 */
export default function Magnetic({ children, strength = 0.2 }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: 'relative', display: 'inline-block' }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
