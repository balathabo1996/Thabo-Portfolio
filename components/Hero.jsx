"use client";
import Icon from "./Icon";

import { useState } from "react";
import Image from "next/image";
import ResumeButton from "./ResumeButton";

export default function Hero({ profile = {} }) {
  const [imageFailed, setImageFailed] = useState(false);
  const firstName = profile.firstName || "Thabotharan";
  const lastName = profile.lastName || "Balachandran";
  const image = "/images/thabo-cutout.png";
  return (
    <section className="hero container studio-hero" id="home" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true"><span /><span /><div className="atmosphere-grid" /></div>
      <div className="hero-content">
        <div className="hero-eyebrow"><span className="status-dot" /> Infrastructure. Security. Development.</div>
        <p className="hero-intro">Hello, I’m {firstName}.</p>
        <h1 id="hero-heading" className="studio-headline"><span className="headline-line"><span>Reliable systems.</span></span><span className="headline-line"><span><em>Secure by design.</em></span></span></h1>
        <p className="studio-role">{profile.title || profile.role || "Infrastructure Engineer | IT Solutions Professional"}</p>
        <p className="hero-description-text">{profile.heroDescription || "Building resilient infrastructure, secure systems, and thoughtful digital experiences."}</p>
        <div className="hero-actions">
          <a className="studio-primary" href="#projects"><span>Explore my work</span><Icon name="arrowRight" /></a>
          {profile.resumeUrl && <ResumeButton resumeUrl={profile.resumeUrl} />}
        </div>
        <div className="studio-socials">
          <span><Icon name="pin" /> {profile.location || "Scarborough, Ontario, Canada"}</span>
          <a href={profile.githubUrl || "https://github.com/balathabo1996"} target="_blank" rel="noopener noreferrer">GitHub <Icon name="external" /></a>
          <a href={profile.linkedinUrl || "https://www.linkedin.com/in/balachandran-thabotharan"} target="_blank" rel="noopener noreferrer">LinkedIn <Icon name="external" /></a>
        </div>
      </div>
      <div className="studio-visual cutout-visual">
        <div className="orbit orbit-one" aria-hidden="true"><span /></div>
        <div className="orbit orbit-two" aria-hidden="true"><span /></div>
        <div className="portrait-panel portrait-cutout">
          <div className="studio-portrait">
            {!imageFailed ? <Image src={image} width={1024} height={1536} sizes="(max-width: 700px) 320px, 380px" quality={80} alt={`${firstName} ${lastName}`} loading="eager" fetchPriority="high" onError={() => setImageFailed(true)} /> : <span className="portrait-monogram">{firstName[0]}{lastName[0]}</span>}
          </div>
          <div className="portrait-caption"><strong>{firstName}<br />{lastName}</strong><span>Engineer.<br />Problem solver.</span></div>
        </div>
        <div className="visual-coordinate" aria-hidden="true">01 / HUMAN × TECHNOLOGY</div>
        <div className="system-note" aria-hidden="true"><span className="status-dot" /><div>Built to connect.<small>Designed to keep moving.</small></div><i className="fas fa-network-wired" /></div>
      </div>
      <div className="hero-bottomline"><a href="#about"><Icon name="down" /> Scroll to discover</a><span>INFRASTRUCTURE / CODE / CURIOSITY</span></div>
    </section>
  );
}
