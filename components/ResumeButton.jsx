/**
 * Download & Track Resume Button — components/ResumeButton.jsx
 * ==========================================================
 * Interactive magnet-aligned action button that lets users download the PDF resume document.
 * Calls the API endpoint POST /api/analytics/resume on click to log a metrics visit event.
 */

'use client';
import Magnetic from "./Magnetic";

/**
 * ResumeButton Component
 * Renders the downloadable Resume action button wrapped inside a Magnetic interactive container.
 *
 * @param {Object} props
 * @param {string} [props.resumeUrl="/resume.pdf"] - Download target path or storage provider URL
 * @returns {React.ReactElement} The Magnetic-aligned Resume Button JSX
 */
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
