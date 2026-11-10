/**
 * Technical Skills Section — components/SkillsSection.jsx
 * =======================================================
 * Displays technical proficiencies in a clean, balanced 2-column grid.
 * Simple, elegant layout without skill count badges, nested sub-badges, or tooltips.
 */

import Image from 'next/image';

const CATEGORY_MAP = {
  'infra': { title: 'Infrastructure & Operating Systems', icon: 'fas fa-server', class: 'infra' },
  'virt': { title: 'Virtualization & Cloud Tools', icon: 'fas fa-layer-group', class: 'virt' },
  'prog': { title: 'Programming & Web Technologies', icon: 'fas fa-code', class: 'prog' },
  'db': { title: 'Databases & Storage', icon: 'fas fa-database', class: 'db' },
  'sec': { title: 'Security & IT Practices', icon: 'fas fa-shield-alt', class: 'sec' },
  'soft': { title: 'Soft Skills & Leadership', icon: 'fas fa-user-check', class: 'soft' }
};

export default function SkillsSection({ dbSkills = {} }) {
  // Ordered categories present in dbSkills
  const categoriesToRender = Object.keys(CATEGORY_MAP)
    .filter(key => dbSkills[key] && dbSkills[key].length > 0)
    .concat(Object.keys(dbSkills).filter(key => !CATEGORY_MAP[key] && dbSkills[key] && dbSkills[key].length > 0));

  return (
    <div className="section-group mt-5 skills-enhanced-wrapper">
      {/* Section Header */}
      <div className="section-header">
        <div>
          <h2>Technical Expertise</h2>
          <p className="section-subtitle">
            Core competencies, infrastructure systems, and technical proficiencies
          </p>
        </div>
        <div className="section-line"></div>
      </div>

      {/* 2-Column Skills Grid */}
      <div className="skills-grid">
        {categoriesToRender.map((category) => {
          const skills = dbSkills[category] || [];
          const catInfo = CATEGORY_MAP[category] || {
            title: category,
            icon: 'fas fa-cog',
            class: category
          };

          return (
            <div key={category} className={`skill-category ${catInfo.class}`}>
              <div className="skill-category-header">
                <div className="d-flex align-items-center gap-2">
                  <div className="category-icon-bubble">
                    <i className={catInfo.icon}></i>
                  </div>
                  <h3>{catInfo.title}</h3>
                </div>
              </div>

              <div className="skill-tags">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge rounded-pill d-inline-flex align-items-center"
                  >
                    {skill.imageUrl ? (
                      <Image
                        src={skill.imageUrl}
                        alt={skill.name}
                        className="me-2 skill-brand-img"
                        width={18}
                        height={18}
                        unoptimized
                      />
                    ) : (
                      skill.icon && <i className={`${skill.icon} me-2 skill-brand-fa`}></i>
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
  );
}
