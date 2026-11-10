"use client";
import { useState } from "react";

const capabilities = ["Infrastructure", "Virtualization", "System security", "Web development", "Problem solving"];
export default function CapabilityStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`capability-strip ${paused ? "is-paused" : ""}`}>
      <div className="capability-window">
        <div className="capability-track">
          {[0, 1].map(copy => <div className="capability-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{capabilities.map(name => <span key={name}>{name}<span className="strip-star" aria-hidden="true">✳</span></span>)}</div>)}
        </div>
      </div>
      <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play capability animation" : "Pause capability animation"} aria-pressed={paused}><span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span></button>
    </div>
  );
}
