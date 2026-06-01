/**
 * Projects Portfolio Showcase Grid — components/ProjectsGrid.jsx
 * =============================================================
 * Renders a grid portfolio containing individual card links mapping project records.
 * Integrates visual category indicators, technology specific FontAwesome/custom icons,
 * lists core features, highlight badges, awards details, and timeline information.
 */

import Image from "next/image";

/**
 * ProjectsGrid Component
 * Generates an interactive visual grid mapping projects items from database models.
 *
 * @param {Object} props
 * @param {Array} props.dbProjects - List of project records fetched from MongoDB
 * @param {string} props.dbProjects[].title - Primary project title name
 * @param {string} [props.dbProjects[].subTitle] - Secondary project subtitle or scope description
 * @param {string} [props.dbProjects[].link] - Hyperlink target of the project or case study
 * @param {string} [props.dbProjects[].imageUrl] - Project preview image asset URL
 * @param {string} [props.dbProjects[].period] - Duration timeline of the work
 * @param {string} [props.dbProjects[].category] - Category value for specific color coding (e.g. "web", "infra")
 * @param {string} [props.dbProjects[].award] - Optional recognition or honors title
 * @param {string} [props.dbProjects[].description] - Descriptive summary paragraph
 * @param {Array<string>} [props.dbProjects[].features] - Major features/bullet points
 * @param {Array<string>} [props.dbProjects[].techStack] - Array of technology names used
 * @returns {React.ReactElement} The styled grid and title section
 */
export default function ProjectsGrid({ dbProjects = [] }) {
  const getTechIcon = (name) => {
    const icons = {
      'Next.js 15': 'fas fa-rocket',
      'Next.js': 'fas fa-rocket',
      'React 19': 'fab fa-react',
      'React.js': 'fab fa-react',
      'TypeScript': 'fas fa-code',
      'Tailwind CSS 4': 'fab fa-css3-alt',
      'MongoDB': 'fas fa-leaf',
      'Google Maps API': 'fas fa-map-marker-alt',
      'Spring Boot': 'fas fa-leaf',
      'Java': 'fab fa-java',
      'Python': 'fab fa-python',
      'PostgreSQL': 'fas fa-database',
      'Node.js': 'fab fa-node-js',
      'Express.js': 'fas fa-bolt',
      'Express': 'fas fa-bolt',
      'Handlebars': 'fas fa-code',
      'JWT': 'fas fa-key',
      'Vercel': 'fas fa-cloud-upload-alt',
      'Laravel': 'fab fa-laravel',
      'PHP': 'fab fa-php',
      'HTML5': 'fab fa-html5',
      'JavaScript': 'fab fa-js',
      'Bootstrap': 'fab fa-bootstrap',
      'Firebase': 'fas fa-fire',
      'Material UI': 'fab fa-uikit'
    };
    return icons[name] || icons[name.split(' ')[0]] || 'fas fa-code';
  };

  return (
    <section id="projects" className="py-5 reveal">
      <div className="container">
        <h1 className="page-title display-5 fw-bold reveal">
          <i className="fas fa-briefcase"></i> My <span>Projects</span>
        </h1>

        <div className="portfolio-grid reveal-stagger">
          {dbProjects.map((project, index) => (
            <a
              key={index}
              href={project.link || "#"}
              className="portfolio-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="portfolio-img-wrapper">
                <Image
                  src={project.imageUrl || "/images/placeholder.png"}
                  alt={project.title}
                  width={800}
                  height={600}
                />
                {project.period && <div className="portfolio-date">{project.period}</div>}
              </div>
              <div className="portfolio-content">
                <div className="portfolio-header">
                  <h3>{project.title}</h3>
                </div>
                {project.subTitle && <p className="project-title-ext">{project.subTitle}</p>}

                {project.award && (
                  <p className="project-award">
                    {project.award.split(':').map((part, i) => (
                      i === 0 ? <strong key={i}>{part}:</strong> : <span key={i}>{part}</span>
                    ))}
                  </p>
                )}

                <p className="project-desc">{project.description}</p>

                <div className="features-list">
                  <ul>
                    {project.features && project.features.map((feature, fIdx) => {
                      const [title, desc] = feature.split(':');
                      return (
                        <li key={fIdx}>
                          {desc ? (
                            <>
                              <strong>{title}:</strong> {desc}
                            </>
                          ) : (
                            feature
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="tech-stack-container" style={{ flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                  {project.techStack && project.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className={`tech-badge ${project.category || 'web'} d-inline-flex align-items-center`}>
                      <i className={`${getTechIcon(tech)} me-2`}></i>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
