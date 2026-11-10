"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal, .reveal-stagger");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) {
      elements.forEach(element => element.classList.add("active"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    elements.forEach(element => {
      // Only hide elements after the observer is ready; SSR remains readable.
      element.classList.add("reveal-ready");
      observer.observe(element);
    });
    const handlePreference = () => {
      if (preference.matches) {
        elements.forEach(element => element.classList.add("active"));
        observer.disconnect();
      }
    };
    preference.addEventListener("change", handlePreference);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", handlePreference);
      elements.forEach(element => element.classList.remove("reveal-ready"));
    };
  }, []);
  return null;
}
