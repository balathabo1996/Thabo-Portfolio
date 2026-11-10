"use client";

import { useRef } from "react";

// CSS variables keep pointer feedback off React's render path.
export default function InteractiveSurface({ children, className = "" }) {
  const ref = useRef(null);
  function move(event) {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const style = ref.current.style;
    style.setProperty("--pointer-x", `${x}px`);
    style.setProperty("--pointer-y", `${y}px`);
  }
  return <div ref={ref} className={`interactive-surface ${className}`} onPointerMove={move}>{children}</div>;
}
