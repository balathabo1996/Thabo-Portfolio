/**
 * Smooth Scroll-Reveal Animation Provider — components/ScrollReveal.jsx
 * ====================================================================
 * Client component that configures dynamic staggered viewports, opacity fades,
 * and translation lifts as elements enter or leave the viewport using Framer Motion.
 * Fallback patterns automatically enable instant visibility if users prefer reduced motion.
 */

"use client";
import { useEffect } from "react";
import { animate, inView, stagger } from "framer-motion";

/**
 * ScrollReveal Component
 * Side-effect client component that tracks elements matching CSS selectors (.reveal,
 * .reveal-stagger, .timeline, etc.) and animates them inside the viewport.
 *
 * @returns {React.ReactElement} A styled template tag containing prefers-reduced-motion fallback directives
 */
export default function ScrollReveal() {
  useEffect(() => {
    // 1. Simple Reveal
    inView(
      ".reveal",
      (element) => {
        animate(
          element,
          { opacity: [0, 1], y: [40, 0] },
          { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
        );
      },
      { margin: "-50px" },
    );

    // 2. Generic Stagger
    inView(
      ".reveal-stagger",
      (element) => {
        const children = Array.from(element.children);
        if (children.length) {
          animate(
            children,
            { opacity: [0, 1], y: [30, 0] },
            {
              duration: 0.6,
              delay: stagger(0.15),
              ease: [0.21, 0.47, 0.32, 0.98],
            },
          );
        }
      },
      { margin: "-50px" },
    );

    // 3. Timeline Stagger
    inView(
      ".timeline",
      (element) => {
        const items = element.querySelectorAll(".timeline-item");
        if (items.length) {
          animate(
            items,
            { opacity: [0, 1], y: [40, 0] },
            {
              duration: 0.6,
              delay: stagger(0.15),
              ease: [0.21, 0.47, 0.32, 0.98],
            },
          );
        }
      },
      { margin: "-50px" },
    );

    // 4. Portfolio Stagger
    inView(
      ".portfolio-grid",
      (element) => {
        const items = element.querySelectorAll(".portfolio-card");
        if (items.length) {
          animate(
            items,
            { opacity: [0, 1], y: [50, 0] },
            {
              duration: 0.7,
              delay: stagger(0.15),
              ease: [0.21, 0.47, 0.32, 0.98],
            },
          );
        }
      },
      { margin: "-50px" },
    );

    // 5. Skills Stagger
    inView(
      ".skills-category-container",
      (element) => {
        const items = element.querySelectorAll(".skill-category-group");
        if (items.length) {
          animate(
            items,
            { opacity: [0, 1], scale: [0.95, 1] },
            { duration: 0.5, delay: stagger(0.1), ease: "easeOut" },
          );
        }
      },
      { margin: "-50px" },
    );

    // 6. Generic Simple Cards (Certifications, Volunteer)
    inView(
      ".grid-2-col",
      (element) => {
        const items = element.querySelectorAll(".simple-card");
        if (items.length) {
          animate(
            items,
            { opacity: [0, 1], y: [30, 0] },
            {
              duration: 0.6,
              delay: stagger(0.1),
              ease: [0.21, 0.47, 0.32, 0.98],
            },
          );
        }
      },
      { margin: "-50px" },
    );
  }, []);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      .reveal, .timeline-item, .portfolio-card, .skill-category-group, .simple-card { opacity: 0; }
      .reveal-stagger > * { opacity: 0; }
      @media (prefers-reduced-motion: reduce) {
        .reveal, .timeline-item, .portfolio-card, .skill-category-group, .simple-card, .reveal-stagger > * {
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `,
      }}
    />
  );
}
