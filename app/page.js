import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";
import Experience from "@/lib/models/Experience";
import Project from "@/lib/models/Project";
import Skill from "@/lib/models/Skill";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import Magnetic from "@/components/Magnetic";
import NetworkBackground from "@/components/NetworkBackground";
import Image from "next/image";

// Use Incremental Static Regeneration (ISR) to rebuild page every 1 hour (3600s)
export const revalidate = 3600;

export const metadata = {
  metadataBase: new URL("https://thabo-portfolio.vercel.app"),
  title: "Thabo.Projects | Thabotharan Balachandran",
  description:
    "Portfolio of Thabotharan Balachandran, an experienced Infrastructure Engineer & IT Professional specializing in System Administration and Web Development.",
  openGraph: {
    title: "Thabo.Projects | Thabotharan Balachandran",
    description: "Infrastructure Engineer & IT Solutions Professional",
    url: "https://thabo-portfolio.vercel.app",
    siteName: "Thabo Portfolio",
    images: [
      {
        url: "/images/portf.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thabo.Projects | Thabotharan Balachandran",
    description: "Infrastructure Engineer & IT Solutions Professional",
    images: ["/images/portf.png"],
  },
  icons: {
    icon: "https://img.icons8.com/ios-filled/50/000000/home.png",
    shortcut: "https://img.icons8.com/ios-filled/50/000000/home.png",
  },
};

export default async function HomePage() {
  // Safe defaults for static-first reliability
  let profileImageUrl = "/images/portf.png";
  let achievements = [];
  let voluntary = [];
  let dbProjects = [];
  let dbSkills = {};

  try {
    // Attempt database connection
    await connectToDatabase();

    // 1. Fetch Profile Data (for the profile picture)
    const profile = await Profile.findOne().lean();
    if (profile?.profileImageUrl) {
      profileImageUrl = profile.profileImageUrl;
    }

    // 2. Fetch Additional Experiences (Achievements & Voluntary)
    const allExperiences = await Experience.find().sort({ order: 1 }).lean();
    achievements = allExperiences.filter((e) => e.type === "achievement");
    voluntary = allExperiences.filter((e) => e.type === "voluntary");

    // 3. Fetch Projects
    dbProjects = await Project.find().sort({ order: 1 }).lean();

    // 4. Fetch Skills and group them
    const skillsList = await Skill.find().sort({ order: 1 }).lean();
    dbSkills = skillsList.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

  } catch (error) {
    // Silently log error to server console; page continues with defaults
    console.error("Database sync notice (using static fallbacks):", error.message);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero container" id="home" style={{ position: 'relative' }}>
        <NetworkBackground />
        <div className="hero-content reveal" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="hero-name">
            <span>Thabotharan</span> <br />
            <span>Balachandran</span>
          </h2>

          <p className="hero-description-blue">
            Infrastructure Engineer | IT Solutions Student | <br />{" "}
            Cybersecurity Enthusiast
          </p>

          <h3 className="hero-tagline-white">
            Building Resilient Infrastructures &amp; Secure Systems
          </h3>

          <div className="hero-contact reveal-stagger">
            <div className="contact-row">
              <span className="contact-item">
                <i className="fas fa-map-marker-alt"></i> Scarborough, Ontario,
                Canada
              </span>
            </div>

            <div className="contact-row">
              <span className="contact-item">
                <i className="fas fa-envelope"></i>
                <a href="mailto:balathabo96@gmail.com">balathabo96@gmail.com</a>
              </span>
              <span className="separator">|</span>
              <span className="contact-item">
                <i className="fas fa-phone"></i>
                <a href="tel:+14373831996">(437) 383-1996</a>
              </span>
            </div>

            <div className="contact-row">
              <span className="contact-item">
                <i className="fab fa-linkedin"></i>
                <Magnetic strength={0.15}>
                  <a
                    href="https://www.linkedin.com/in/balachandran-thabotharan-261895131"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Balachandran Thabotharan
                  </a>
                </Magnetic>
              </span>
              <span className="separator">|</span>
              <span className="contact-item">
                <i className="fab fa-github"></i>
                <Magnetic strength={0.15}>
                  <a
                    href="https://github.com/balathabo1996"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    balathabo1996
                  </a>
                </Magnetic>
              </span>
            </div>
          </div>

          <p className="hero-description-text">
            Leveraging expertise in Windows environments, virtualization, and
            security to deliver scalable IT solutions.
          </p>

          <div className="hero-actions">
            <Magnetic>
              <a href="/resume.pdf" target="_blank" className="btn btn-cta">
                VIEW RESUME
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="hero-image" style={{ position: 'relative', zIndex: 1 }}>
          <div className="image-wrapper reveal">
            <Image
              id="profile-image"
              src={profileImageUrl}
              alt="Thabotharan - Infrastructure Engineer"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* About Section */}
      <section id="about" className="py-5 reveal">
        <div className="container">
          <h1 className="page-title display-5 fw-bold reveal">
            <i className="fas fa-user-tie"></i> Professional{" "}
            <span>Profile</span>
          </h1>

          <div className="resume-section">
            {/* Intro / Summary */}
            <div className="about-intro reveal">
              <p className="lead">
                My journey in IT began with a fascination for how large-scale
                systems connect and operate. This led me to pursue a degree in
                ICT, where I built a strong technical foundation. I quickly
                transitioned into an Infrastructure Engineer role, where I spent
                three years managing Windows environments and virtualization at
                an enterprise level. Realizing the critical importance of
                security in modern infrastructure, I decided to specialize
                further, currently pursuing postgraduate studies in IT Solutions
                to master cybersecurity and resilient system architecture.
              </p>

              <div className="career-goal">
                <h4>Professional Mission</h4>
                <p>
                  I am an experienced Infrastructure Engineer with over 7 years
                  of expertise in System Administration, Virtualization, and
                  Network Management. I specialize in designing and maintaining
                  robust IT architectures that empower business growth and
                  operational efficiency.
                </p>
                <p>
                  My technical journey is fueled by a passion for solving
                  complex infrastructure challenges and a commitment to
                  continuous learning in the ever-evolving landscape of
                  technology.
                </p>
              </div>
            </div>

            {/* Technical Skills Section */}
            {Object.keys(dbSkills).length > 0 && (
              <div className="section-group mt-5">
                <div className="section-header reveal">
                  <h2>Technical Expertise</h2>
                  <div className="section-line"></div>
                </div>
                <div className="skills-grid reveal-stagger">
                  {Object.entries(dbSkills).map(([category, skills]) => {
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

            {/* Education Section */}
            <div className="section-header reveal">
              <h2>Education</h2>
              <div className="section-line"></div>
            </div>

            <div className="timeline reveal-stagger">
              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>
                        Post Graduate Certificate – Information Technology
                        Solutions
                      </h3>
                      <h4>
                        <a href="https://humber.ca/explore-programs/programs/information-technology-solutions" target="_blank" rel="noopener noreferrer" className="company-link">
                          Humber College
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Sep 2024 – Present</span>
                      <span className="location">Ontario, Canada</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>
                        Bachelor of Information and Communication Technology
                        (Hons)
                      </h3>
                      <h4>
                        <a href="https://tech.sjp.ac.lk/" target="_blank" rel="noopener noreferrer" className="company-link">
                          Faculty of Technology (FOT), University of Sri Jayewardenepura
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Aug 2016 – Apr 2021</span>
                      <span className="location">Colombo, Sri Lanka</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>G.C.E. Advanced Level</h3>
                      <h4>
                        <a href="https://en.wikipedia.org/wiki/Chavakachcheri_Hindu_College" target="_blank" rel="noopener noreferrer" className="company-link">
                          Chavakachcheri Hindu College
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Jan 2013 – Aug 2015</span>
                      <span className="location">Jaffna, Sri Lanka</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>G.C.E. Ordinary Level</h3>
                      <h4>
                        <a href="https://stjohns.edu.lk/" target="_blank" rel="noopener noreferrer" className="company-link">
                          St. John&apos;s College
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Jan 2010 – Dec 2012</span>
                      <span className="location">Jaffna, Sri Lanka</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Experience Section */}

            {/* Experience Section */}
            <div className="section-header reveal">
              <h2>Professional Experience</h2>
              <div className="section-line"></div>
            </div>

            <div className="timeline reveal-stagger">
              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>Accounting Assistant</h3>
                      <h4>
                        <a
                          href="https://www.g2000express.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-link"
                        >
                          G2000 Express Inc.
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Nov 2024 – Present</span>
                      <span className="location">Ontario, Canada</span>
                    </div>
                  </div>
                  <ul>
                    <li>Manage daily fuel expense tracking for fleet operations, monitoring fuel usage, costs, and identifying opportunities to optimize fuel consumption.</li>
                    <li>Coordinate with fuel suppliers to ensure competitive pricing and uninterrupted fuel availability for fleet vehicles.</li>
                    <li>Conduct and maintain records of truck safety inspections, ensuring compliance with transportation safety standards and regulations.</li>
                    <li>Schedule and track vehicle maintenance activities to reduce breakdown risks and improve operational reliability.</li>
                    <li>Support driver safety initiatives by assisting with safety training coordination and incident follow-ups.</li>
                    <li>Utilize fleet management software to monitor vehicle performance, maintenance requirements, and operational data.</li>
                    <li>Prepare detailed fuel, safety, and performance reports for management review and decision-making.</li>
                    <li>Handle invoicing and billing operations, including verification of trip details such as mileage, fuel charges, detention hours, and accessorial fees.</li>
                    <li>Track payments, manage outstanding invoices, and coordinate with accounting teams to ensure accurate financial reconciliation.</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>Full Stack Developer (Internship)</h3>
                      <h4>
                        <a
                          href="https://oraclelens.com/home"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-link"
                        >
                          OracleLens
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Jan 2026 – Apr 2026</span>
                      <span className="location">Toronto, Ontario, Canada (Remote)</span>
                    </div>
                  </div>
                  <ul>
                    <li><strong>Award:</strong> Awarded "Best Project in Information Technology Solutions" at the Humber College Capstone EXPO for engineering a distributed Virtual Power Plant (VPP) architecture in collaboration with industry sponsor OracleLens.</li>
                    <li><strong>Systems Architecture:</strong> Engineered a secure, containerized control plane that integrated real-time grid communication, predictive energy forecasting, and physical hardware abstraction into a single cohesive platform.</li>
                    <li><strong>Backend Dispatch Logic:</strong> Developed the central algorithmic "Brain" to ingest percentage-based load shed signals and calculate precise, physically constrained kW discharge targets for simulated energy assets.</li>
                    <li><strong>SCADA UI Development:</strong> Built a real-time Human-Machine Interface (HMI) to visually orchestrate dispatch events, mapping backend control logic to live dashboard animations of battery State of Charge (SoC) and power output.</li>
                    <li><strong>Measurement &amp; Verification (M&amp;V):</strong> Implemented a high-fidelity telemetry logging pipeline to generate immutable digital receipts (baseline kW, delivered kWh, timestamps) required for grid performance verification.</li>
                    <li><strong>Network Security:</strong> Established secure cross-machine communication bridges utilizing cryptographic key management to ensure authenticated messaging across the distributed network.</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>Infrastructure Engineer</h3>
                      <h4>
                        <a
                          href="https://www.hcltech.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-link"
                        >
                          HCLTech Lanka (PVT) Ltd.
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Jul 2021 – Apr 2024</span>
                      <span className="location">Colombo, Sri Lanka</span>
                    </div>
                  </div>
                  <ul>
                    <li>Designed and implemented Windows-based infrastructure solutions aligned with organizational needs, ensuring scalability, security, and optimal performance.</li>
                    <li>Deployed and configured Windows servers and workstations, including Active Directory, user accounts, permissions, and network configurations.</li>
                    <li>Utilized virtualization technologies such as Hyper-V and VMware to improve infrastructure efficiency.</li>
                    <li>Implemented backup strategies and disaster recovery plans to protect critical data and minimize downtime.</li>
                    <li>Maintained detailed technical documentation for system configurations and troubleshooting procedures.</li>
                    <li>Applied industry-standard security practices to protect systems from vulnerabilities and threats.</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>Web Application Developer</h3>
                      <h4>
                        <a
                          href="https://infonits.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-link"
                        >
                          Infonits
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Jan 2021 – Jun 2021</span>
                      <span className="location">Jaffna, Sri Lanka</span>
                    </div>
                  </div>
                  <ul>
                    <li>Publicized effective collaboration with front-end developers, integrating user-facing elements with server-side logic for an enhanced user experience.</li>
                    <li>Improved application performance by fine-tuning database queries and server processes.</li>
                    <li>Participated in code reviews, delivering constructive feedback to maintain high code quality and adherence to best practices.</li>
                    <li>Collaborated with cross-functional teams, including UI/UX designers and product managers, ensuring timely and successful project delivery.</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-item">
                <div className="resume-card">
                  <div className="card-header">
                    <div className="role-info">
                      <h3>Intern</h3>
                      <h4>
                        <a
                          href="https://hnb.lk/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-link"
                        >
                          Hatton National Bank PLC
                        </a>
                      </h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Jun 2016 – Dec 2016</span>
                      <span className="location">Jaffna, Sri Lanka</span>
                    </div>
                  </div>
                  <ul>
                    <li>Provided exceptional customer service, resolving inquiries and issues with a positive and professional approach.</li>
                    <li>Gained valuable insights into banking operations, processing transactions, and updating customer information while adhering to policies.</li>
                    <li>Synthesized risk management efforts, assisting in identifying potential operational risks.</li>
                    <li>Ensured compliance with banking regulations and legal requirements, fostering a well-regulated environment.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Achievements & Certifications */}
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voluntary Contributions */}
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Projects Section */}
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
                    {project.techStack && project.techStack.map((tech, tIdx) => {
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
                        <span key={tIdx} className={`tech-badge ${project.category || 'web'} d-inline-flex align-items-center`}>
                          <i className={`${getTechIcon(tech)} me-2`}></i>
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Contact Section */}
      <section id="contact" className="py-5 reveal">
        <div className="container">
          <h1 className="page-title display-5 fw-bold reveal">
            <i className="fas fa-envelope-open-text"></i> Get in{" "}
            <span>Touch</span>
          </h1>

          <div className="contact-wrapper">
            <div className="contact-info-panel reveal">
              <h3 className="reveal">Contact Information</h3>
              <ul className="contact-list reveal-stagger">
                <li>
                  <div className="icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="details">
                    <strong>Email</strong>
                    <a href="mailto:balathabo96@gmail.com">
                      balathabo96@gmail.com
                    </a>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="fab fa-linkedin-in"></i>
                  </div>
                  <div className="details">
                    <strong>LinkedIn</strong>
                    <a
                      href="https://www.linkedin.com/in/balachandran-thabotharan-261895131"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      balachandran-thabotharan
                    </a>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="fab fa-github"></i>
                  </div>
                  <div className="details">
                    <strong>GitHub</strong>
                    <a
                      href="https://github.com/balathabo1996"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      balathabo1996
                    </a>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="details">
                    <strong>Phone</strong>
                    <a href="tel:+14373831996">(437) 383-1996</a>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="details">
                    <strong>Location</strong>
                    <p>Scarborough, Ontario, Canada</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="contact-form reveal">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <ScrollReveal />
    </>
  );
}
