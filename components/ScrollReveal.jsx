/**
 * ScrollReveal  —  components/ScrollReveal.jsx
 * =============================================
 * Client component that drives CSS enter / exit animations for elements
 * tagged with the utility classes .reveal, .reveal-stagger, or .reveal-scale.
 *
 * Uses a single IntersectionObserver instance with the following behaviour:
 *   - Adds the .active class when ≥ 5 % of an element enters the viewport,
 *     which triggers the CSS transition defined in globals.css.
 *   - Removes the .active class when the element leaves the viewport so that
 *     animations replay every time the user scrolls back past the element.
 *
 * Renders nothing to the DOM — purely a side-effect component.
 */
'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element fully enters
      threshold: 0.05, // Trigger as soon as 5% of the element is visible
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          // Remove class to fade out when scrolling past (up or down)
          entry.target.classList.remove('active');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Target all elements with .reveal, .reveal-stagger, or .reveal-scale
    const targets = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-scale');
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
    };
  }, []);

  return null; // This component doesn't render anything itself
}
