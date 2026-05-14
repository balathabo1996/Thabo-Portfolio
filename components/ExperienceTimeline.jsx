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
