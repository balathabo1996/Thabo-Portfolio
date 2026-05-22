/**
 * Professional Profile Section Component — components/About.jsx
 * =============================================================
 * Renders the narrative biography, technical expertise, work timeline,
 * education credentials, voluntary contributions, and professional honors sections.
 * Combines responsive grid alignment with interactive dynamic badges and hover scales.
 */

import Image from "next/image";
import ExperienceTimeline from "./ExperienceTimeline";

/**
 * About Component
 * Renders the main identity summary, capabilities categories, and timeline elements.
 * 
 * @param {Object} props
 * @param {Object} [props.profile] - Primary owner profile details
 * @param {string} [props.profile.bio] - Multiline professional narrative intro
 * @param {string} [props.profile.missionTitle] - Subtitle for professional mission
 * @param {string} [props.profile.missionDescription] - Description paragraph for the mission
 * @param {Object} [props.dbSkills] - Technical skill lists categorized by type key (infra, virt, prog, db, sec, soft)
 * @param {Array} [props.achievements] - Key achievements timeline list
 * @param {Array} [props.voluntary] - Volunteer contributions timeline list
 * @param {Array} [props.educationExperience] - Academic background timeline list
 * @param {Array} [props.workExperience] - Professional employment timeline list
 */
export default function About({ 
  profile = {},
  dbSkills = {}, 
  achievements = [], 
  voluntary = [], 
  educationExperience = [],
  workExperience = []
 }) {
  const {
    bio = "Experienced Infrastructure Engineer specializing in Windows environments and virtualization.",
    missionTitle = "Professional Mission",
    missionDescription = "I am an experienced Infrastructure Engineer with over 7 years of expertise in System Administration, Virtualization, and Network Management."
  } = profile;

  return (
    <section id="about" className="py-5 reveal">
      <div className="container">
        {/* Title bar with visual icon */}
        <h1 className="page-title display-5 fw-bold reveal">
          <i className="fas fa-user-tie"></i> Professional{" "}
          <span>Profile</span>
        </h1>

        <div className="resume-section">
          {/* Intro / Summary block */}
          <div className="about-intro reveal">
            <div className="lead">
              {/* Parse double-line spacing paragraph chunks cleanly */}
              {bio.split('\n').map((para, i) => (
                <p key={i} className={i === 0 ? "lead" : ""}>{para}</p>
              ))}
            </div>

            {/* Sub-card describing professional target values or mission goals */}
            <div className="career-goal">
              <h4>{missionTitle}</h4>
              <div className="mission-content">
                {missionDescription.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Skills and capabilities grid section */}
          {Object.keys(dbSkills).length > 0 && (
            <div className="section-group mt-5">
              <div className="section-header reveal">
                <h2>Technical Expertise</h2>
                <div className="section-line"></div>
              </div>
              <div className="skills-grid reveal-stagger">
                {Object.entries(dbSkills).map(([category, skills]) => {
                  // Mappings keys to friendly visual headings
                  const categoryMap = {
                    'infra': { title: 'Infrastructure & Operating Systems', class: 'infra' },
                    'virt': { title: 'Virtualization & Tools', class: 'virt' },
                    'prog': { title: 'Programming & Web Technologies', class: 'prog' },
                    'db': { title: 'Databases', class: 'db' },
                    'sec': { title: 'Security & IT Practices', class: 'sec' },
                    'soft': { title: 'Soft Skills & Leadership', class: 'soft' }
                  };
                  const catInfo = categoryMap[category] || { title: category, class: category };

                  return (
                    <div key={category} className={`skill-category ${catInfo.class} reveal`}>
                      <h3>{catInfo.title}</h3>
                      <div className="skill-tags">
                        {skills.map((skill, idx) => (
                          <span key={idx} className="badge rounded-pill d-inline-flex align-items-center">
                            {/* Prioritize customizable branded image icon, fallback to FontAwesome vector icon */}
                            {skill.imageUrl ? (
                              <Image src={skill.imageUrl} alt={skill.name} className="me-2" width={18} height={18} />
                            ) : (
                              skill.icon && <i className={`${skill.icon} me-2`} style={{ fontSize: '0.85rem' }}></i>
                            )}
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Work Employment history interactive timeline widget */}
          <ExperienceTimeline workExperience={workExperience} />

          {/* Education background section */}
          <div className="section-header reveal">
            <h2>Education</h2>
            <div className="section-line"></div>
          </div>

          <div className="timeline reveal-stagger">
            {educationExperience.length > 0 ? (
              educationExperience.map((edu, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="resume-card">
                    <div className="card-header">
                      <div className="role-info">
                        <h3>{edu.role}</h3>
                        <h4>
                          {edu.companyUrl ? (
                            <a href={edu.companyUrl} target="_blank" rel="noopener noreferrer" className="company-link">
                              {edu.company}
                            </a>
                          ) : (
                            edu.company
                          )}
                        </h4>
                      </div>
                      <div className="meta-info">
                        <span className="date-badge">{edu.period}</span>
                        <span className="location">{edu.location}</span>
                      </div>
                    </div>
                    {/* Render sub bullet points detailing courses or graduation status */}
                    {edu.description && edu.description.length > 0 && (
                      <ul>
                        {edu.description.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No education records found in database.</p>
            )}
          </div>

          {/* Key Achievements, honors, and certificates category */}
          {achievements.length > 0 && (
            <div className="section-group mt-5">
              <div className="section-header reveal">
                <h2>Key Achievements & Certifications</h2>
                <div className="section-line"></div>
              </div>
              <div className="skills-grid reveal-stagger">
                {achievements.map((item, idx) => (
                  <div key={idx} className="skill-category achievement-card">
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{item.role}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.company}</p>
                    {item.description && item.description.length > 0 && (
                      <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>{item.description[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voluntary contributions and communities involvement */}
          {voluntary.length > 0 && (
            <div className="section-group mt-5">
              <div className="section-header reveal">
                <h2>Voluntary Contributions</h2>
                <div className="section-line"></div>
              </div>
              <div className="skills-grid reveal-stagger">
                {voluntary.map((item, idx) => (
                  <div key={idx} className="skill-category voluntary-card">
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{item.role}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.company}</p>
                    {item.description && item.description.length > 0 && (
                      <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>{item.description[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

