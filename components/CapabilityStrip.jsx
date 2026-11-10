"use client";
import { useState } from "react";
import Icon from "./Icon";

const capabilities = [
  { label: "Infrastructure", icon: "server" },
  { label: "Virtualization", icon: "layers" },
  { label: "System security", icon: "shield" },
  { label: "Web development", icon: "code" },
  { label: "Problem solving", icon: "bulb" },
];
export default function CapabilityStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`capability-strip ${paused ? "is-paused" : ""}`}>
      <div className="capability-window">
        <div className="capability-track">
          {[0, 1].map(copy => <div className="capability-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{capabilities.map(({ label, icon }) => <span key={label}><Icon name={icon} className="capability-icon" />{label}</span>)}</div>)}
        </div>
      </div>
      <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play capability animation" : "Pause capability animation"} aria-pressed={paused}><Icon name={paused ? "play" : "pause"} /></button>
    </div>
  );
}
