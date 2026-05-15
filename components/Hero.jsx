'use client';

import NetworkBackground from "./NetworkBackground";
import ResumeButton from "./ResumeButton";
import Magnetic from "./Magnetic";

export default function Hero({ profile = {} }) {
  const {
    firstName = "Thabotharan",
    lastName = "Balachandran",
    title = "Infrastructure Engineer | IT Solutions Professional",
    profileImageUrl = "https://res.cloudinary.com/dk4kvk0kw/image/upload/v1/thabo-portfolio/profileImageUrl.png",
    location = "Scarborough, Ontario, Canada",
    email = "balathabo96@gmail.com",
    phone = "(437) 383-1996",
    linkedinUrl = "https://www.linkedin.com/in/balachandran-thabotharan",
    githubUrl = "https://github.com/balathabo1996",
    tagline = "Building Resilient Infrastructures & Secure Systems",
    heroDescription = "Leveraging expertise in Windows environments, virtualization, and security to deliver scalable IT solutions.",
    resumeUrl = "/resume.pdf"
  } = profile;

  return (
    <section className="hero container" id="home" style={{ position: 'relative' }}>
      <NetworkBackground />
      <div className="hero-content reveal" style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="hero-name">
          <span>{firstName}</span> <br />
          <span>{lastName}</span>
        </h2>

        <p className="hero-description-blue">
          {title.split(' | ').map((part, index, arr) => (
            <span key={index}>
              {part}{index < arr.length - 1 ? ' | ' : ''}
              {index === 1 && <br />}
            </span>
          ))}
        </p>

        <h3 className="hero-tagline-white">
          {tagline}
        </h3>

        <div className="hero-contact reveal-stagger">
          <div className="contact-row">
            <span className="contact-item">
              <i className="fas fa-map-marker-alt"></i> {location}
            </span>
          </div>

          <div className="contact-row">
            <span className="contact-item">
              <i className="fas fa-envelope"></i>
              <a href={`mailto:${email}`}>{email}</a>
            </span>
            <span className="separator">|</span>
            <span className="contact-item">
              <i className="fas fa-phone"></i>
              <a href={`tel:${phone}`}>{phone}</a>
            </span>
          </div>

          <div className="contact-row">
            <span className="contact-item">
              <i className="fab fa-linkedin"></i>
              <Magnetic strength={0.15}>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {firstName} {lastName}
                </a>
              </Magnetic>
            </span>
            <span className="separator">|</span>
            <span className="contact-item">
              <i className="fab fa-github"></i>
              <Magnetic strength={0.15}>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {githubUrl?.split('/').pop() || "GitHub"}
                </a>
              </Magnetic>
            </span>
          </div>
        </div>

        <p className="hero-description-text">
          {heroDescription}
        </p>

        <div className="hero-actions">
          <ResumeButton resumeUrl={resumeUrl} />
        </div>
      </div>

      <div className="hero-image" style={{ position: 'relative', zIndex: 1 }}>
        <div className="image-wrapper reveal">
          <img
            id="profile-image"
            src={profileImageUrl}
            alt={`${firstName} - Infrastructure Engineer`}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            loading="eager"
            fetchPriority="high"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>
    </section>
  );
}
