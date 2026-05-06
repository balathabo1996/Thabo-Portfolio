'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
        // Removed the else block to prevent sections from disappearing
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px 0px 200px 0px', // More lenient margin
      threshold: 0, // Trigger as soon as it touches the margin
    });
    const targets = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-scale');
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
    };
  }, []);

  return null;
}
