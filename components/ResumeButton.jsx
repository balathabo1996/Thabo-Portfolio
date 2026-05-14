'use client';
import Magnetic from "./Magnetic";

export default function ResumeButton({ resumeUrl = "/resume.pdf" }) {
  const handleTrack = () => {
    // Fire and forget tracking request
    fetch('/api/analytics/resume', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error("Tracking failed:", err));
  };

  return (
    <Magnetic>
      <a 
        href={resumeUrl} 
        target="_blank" 
        className="btn btn-cta"
        onClick={handleTrack}
      >
        VIEW RESUME
      </a>
    </Magnetic>
  );
}
