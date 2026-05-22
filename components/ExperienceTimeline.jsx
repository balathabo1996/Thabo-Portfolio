/**
 * ExperienceTimeline Component — components/ExperienceTimeline.jsx
 * ================================================================
 * Renders an interactive vertical timeline detailing employment history,
 * job roles, company associations, geographical locations, and key responsibilities.
 */

/**
 * ExperienceTimeline Component
 * Generates employment timeline events mapping professional experience models.
 *
 * @param {Object} props
 * @param {Array} props.workExperience - Array of work experience objects
 * @param {string} props.workExperience[].role - Job title or position held
 * @param {string} props.workExperience[].company - Name of the organization
 * @param {string} [props.workExperience[].companyUrl] - Optional link to the company website
 * @param {string} props.workExperience[].period - Date duration or period (e.g., "2020 - Present")
 * @param {string} props.workExperience[].location - Location of the company
 * @param {Array<string>} [props.workExperience[].description] - Responsibilities or achievements list
 * @returns {React.ReactElement} The styled work experience timeline
 */
export default function ExperienceTimeline({ workExperience = [] }) {
  return (
    <>
      <div className="section-header reveal">
        <h2>Professional Experience</h2>
        <div className="section-line"></div>
      </div>

      <div className="timeline reveal-stagger">
        {workExperience.length > 0 ? (
          workExperience.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="resume-card">
                <div className="card-header">
                  <div className="role-info">
                    <h3>{exp.role}</h3>
                    <h4>
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-link"
                        >
                          {exp.company}
                        </a>
                      ) : (
                        exp.company
                      )}
                    </h4>
                  </div>
                  <div className="meta-info">
                    <span className="date-badge">{exp.period}</span>
                    <span className="location">{exp.location}</span>
                  </div>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul>
                    {exp.description.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No professional experience records found in database.</p>
        )}
      </div>
    </>
  );
}
