import Image from "next/image";

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
                  src={project.imageUrl || "/images/placeholder.jpg"}
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
