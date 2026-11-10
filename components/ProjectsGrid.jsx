/**
 * Projects Portfolio Showcase Grid — components/ProjectsGrid.jsx
 * =============================================================
 * Renders a grid portfolio containing individual card links mapping project records.
 * Integrates visual category indicators, technology specific FontAwesome/custom icons,
 * lists core features, highlight badges, awards details, and timeline information.
 */

import Image from "next/image";
import Icon from "./Icon";
import InteractiveSurface from "./InteractiveSurface";

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
function projectLink(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

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
        <div className="editorial-section-heading reveal"><div><p className="section-kicker">02 / SELECTED WORK</p><h2 className="page-title display-5 fw-bold">Ideas into <span>impact.</span></h2></div><p>A selection of systems, solutions,<br />and things I’ve built.</p></div>

        <div className="portfolio-grid reveal-stagger">
          {dbProjects.map((project, index) => {
            const href = projectLink(project.link);
            const Card = href ? 'a' : 'article';
            return (
            <InteractiveSurface key={project._id || index} className="project-surface">
            <Card
              href={href}
              className="portfolio-card"
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
            >
              <div className="portfolio-img-wrapper">
                <span className="project-index">{String(index + 1).padStart(2, "0")} / PROJECT</span>
                <Image
                  src={project.imageUrl || "/images/placeholder.png"}
                  alt={project.title}
                  width={800}
                  height={600}
                  sizes="(max-width: 700px) 100vw, (max-width: 1240px) 50vw, 580px"
                  loading="lazy"
                />
                {project.period && <div className="portfolio-date">{project.period}</div>}
              </div>
              <div className="portfolio-content">
                <div className="portfolio-header">
                  <h3>{project.title}</h3>
                  {href && <span className="project-open" aria-hidden="true"><Icon name="external" /></span>}
                </div>
                {project.subTitle && <p className="project-title-ext">{project.subTitle}</p>}

                {project.award && (
                  <p className="project-award">
                    {project.award.split(':').map((part, i) => (
                      i === 0 ? <strong key={i}>{part}:</strong> : <span key={i}>{part}</span>
                    ))}
                  </p>
                )}

                {!href && <p className="project-link-status">Project preview · link not available</p>}
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
            </Card>
            </InteractiveSurface>
          );})}
        </div>
      </div>
    </section>
  );
}
