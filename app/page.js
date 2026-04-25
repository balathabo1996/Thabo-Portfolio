import { connectToDatabase } from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';
import Experience from '@/lib/models/Experience';
import Project from '@/lib/models/Project';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Thabo.Portfolio | Thabotharan Balachandran',
  description:
    'Portfolio of Thabotharan Balachandran, an experienced Infrastructure Engineer & IT Professional specializing in System Administration and Web Development.',
  icons: {
    icon: 'https://img.icons8.com/ios-filled/50/000000/home.png',
    shortcut: 'https://img.icons8.com/ios-filled/50/000000/home.png',
  },
};

async function getProfileImage() {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne().lean();
    return profile?.profileImageUrl || '/images/portf.png';
  } catch {
    return '/images/portf.png';
  }
}

export default async function HomePage() {
  await connectToDatabase();
  const profileImageUrl = await getProfileImage();
  
  // Fetch all experience data
  const allExperiences = await Experience.find().sort({ order: 1 }).lean();
  
  // Categorize
  const workExp = allExperiences.filter(e => e.type === 'work');
  const eduExp = allExperiences.filter(e => e.type === 'education');
  const achievements = allExperiences.filter(e => e.type === 'achievement');
  const voluntary = allExperiences.filter(e => e.type === 'voluntary');

  return (
    <>
      {/* Hero Section */}
      <section className="hero container" id="home">
        <div className="hero-content reveal">
          <h2 className="hero-name">
            <span>Thabotharan</span> <br />
            <span>Balachandran</span>
          </h2>
          
          <p className="hero-description-blue">
            Infrastructure Engineer | IT Solutions Student | <br /> Cybersecurity Enthusiast
          </p>

          <h3 className="hero-tagline-white">
            Building Resilient Infrastructures &amp; Secure Systems
          </h3>

          <div className="hero-contact reveal-stagger">
            <div className="contact-row">
              <span className="contact-item">
                <i className="fas fa-map-marker-alt"></i> Scarborough, Ontario, Canada
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
                <a href="https://www.linkedin.com/in/balachandran-thabotharan-261895131" target="_blank" rel="noopener noreferrer">Balachandran Thabotharan</a>
              </span>
              <span className="separator">|</span>
              <span className="contact-item">
                <i className="fab fa-github"></i>
                <a href="https://github.com/balathabo1996" target="_blank" rel="noopener noreferrer">balathabo1996</a>
              </span>
            </div>
          </div>

          <p className="hero-description-text">
            Leveraging expertise in Windows environments, virtualization, and security to deliver scalable IT solutions.
          </p>

          <div className="hero-actions">
            <a href="/resume" target="_blank" className="btn btn-cta">
              VIEW RESUME
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-wrapper reveal">
            <img
              id="profile-image"
              src={profileImageUrl}
              alt="Thabotharan - Infrastructure Engineer"
            />
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* About Section */}
      <section id="about" className="py-5 reveal">
        <div className="container">
          <h1 className="page-title display-5 fw-bold reveal">
            <i className="fas fa-user-tie"></i> Professional <span>Profile</span>
          </h1>

          <div className="resume-section">
            {/* Intro / Summary */}
            <div className="about-intro reveal">
              <p className="lead">
                My journey in IT began with a fascination for how large-scale systems connect and
                operate. This led me to pursue a degree in ICT, where I built a strong technical
                foundation. I quickly transitioned into an Infrastructure Engineer role, where I spent
                three years managing Windows environments and virtualization at an enterprise level.
                Realizing the critical importance of security in modern infrastructure, I decided to
                specialize further, currently pursuing postgraduate studies in IT Solutions to master
                cybersecurity and resilient system architecture.
              </p>
              
              <div className="career-goal">
                <h4>Professional Mission</h4>
                <p>
                  I am an experienced Infrastructure Engineer with over 7 years of expertise in System Administration, Virtualization, and Network Management. I specialize in designing and maintaining robust IT architectures that empower business growth and operational efficiency.
                </p>
                <p>
                  My technical journey is fueled by a passion for solving complex infrastructure challenges and a commitment to continuous learning in the ever-evolving landscape of technology.
                </p>
              </div>
            </div>

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
                      <h3>Post Graduate Certificate – Information Technology Solutions</h3>
                      <h4>Humber College</h4>
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
                      <h3>Bachelor of Information and Communication Technology (Hons)</h3>
                      <h4>University of Sri Jayewardenepura</h4>
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
                      <h4>Chavakachcheri Hindu College</h4>
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
                      <h4>St. John&apos;s College</h4>
                    </div>
                    <div className="meta-info">
                      <span className="date-badge">Jan 2010 – Dec 2012</span>
                      <span className="location">Jaffna, Sri Lanka</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="section-header reveal">
              <h2>Technical Expertise</h2>
              <div className="section-line"></div>
            </div>

            <div className="skills-grid reveal-stagger">
              <div className="skill-category infra">
                <h3>Infrastructure &amp; Operating Systems</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">Windows Server Administration</span>
                  <span className="badge rounded-pill">Active Directory</span>
                  <span className="badge rounded-pill">User &amp; Permission Management</span>
                  <span className="badge rounded-pill">Backup &amp; Disaster Recovery</span>
                </div>
              </div>
              <div className="skill-category virt">
                <h3>Virtualization &amp; Tools</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">Hyper-V</span>
                  <span className="badge rounded-pill">VMware</span>
                  <span className="badge rounded-pill">Git</span>
                  <span className="badge rounded-pill">Postman</span>
                  <span className="badge rounded-pill">JIRA</span>
                </div>
              </div>
              <div className="skill-category prog">
                <h3>Programming &amp; Web Technologies</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">Java</span>
                  <span className="badge rounded-pill">JavaScript</span>
                  <span className="badge rounded-pill">HTML</span>
                  <span className="badge rounded-pill">CSS</span>
                  <span className="badge rounded-pill">XML</span>
                  <span className="badge rounded-pill">Node.js</span>
                  <span className="badge rounded-pill">Express</span>
                </div>
              </div>
              <div className="skill-category db">
                <h3>Databases</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">Oracle Database</span>
                  <span className="badge rounded-pill">MongoDB</span>
                </div>
              </div>
              <div className="skill-category sec">
                <h3>Security &amp; IT Practices</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">System Hardening</span>
                  <span className="badge rounded-pill">Security Protocols</span>
                  <span className="badge rounded-pill">Documentation</span>
                  <span className="badge rounded-pill">GRC &amp; Risk Awareness</span>
                </div>
              </div>
              <div className="skill-category soft">
                <h3>Soft Skills &amp; Leadership</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">Team Leadership</span>
                  <span className="badge rounded-pill">Troubleshooting</span>
                  <span className="badge rounded-pill">Crisis Management</span>
                  <span className="badge rounded-pill">Cross-functional Collaboration</span>
                  <span className="badge rounded-pill">Adaptability</span>
                </div>
              </div>
            </div>

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
                      <h3>Office Clerk</h3>
                      <h4>G2000 Express Inc.</h4>
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
                      <h3>Infrastructure Engineer</h3>
                      <h4>HCLTech Lanka (PVT) Ltd.</h4>
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
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.role}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.company}</p>
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
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.role}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-5 reveal">
        <div className="container">
          <h1 className="page-title display-5 fw-bold reveal">
            <i className="fas fa-briefcase"></i> My <span>Portfolio</span>
          </h1>

          <div className="portfolio-grid reveal-stagger">
            {/* Fleet Operations */}
            <div className="portfolio-card">
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Fleet Operations Management"
                />
              </div>
              <div className="portfolio-content">
                <h3>Fleet Operations Management</h3>
                <p>Managed fleet logistics, fuel tracking, and safety compliance. Optimized operational efficiency through data-driven reporting and maintenance scheduling.</p>
                <div className="features-list">
                  <ul>
                    <li>Fuel Expense Analysis</li>
                    <li>Safety Inspection Compliance</li>
                    <li>Fleet Maintenance Scheduling</li>
                  </ul>
                </div>
                <div className="tech-stack-container">
                  <span className="tech-badge ops">Fleet Mgmt</span>
                  <span className="tech-badge ops">Logistics</span>
                </div>
              </div>
            </div>

            {/* Enterprise Virtualization */}
            <div className="portfolio-card">
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Server Rack Infrastructure"
                />
              </div>
              <div className="portfolio-content">
                <h3>Enterprise Virtualization</h3>
                <p>Designed and implemented scalable Windows-based infrastructure with high-availability virtualization using Hyper-V and VMware.</p>
                <div className="features-list">
                  <ul>
                    <li>Active Directory &amp; User Management</li>
                    <li>Server Hardening &amp; Security</li>
                    <li>High Availability Configuration</li>
                  </ul>
                </div>
                <div className="tech-stack-container">
                  <span className="tech-badge infra">Windows Server</span>
                  <span className="tech-badge infra">VMware</span>
                </div>
              </div>
            </div>

            {/* Secure Web Framework */}
            <div className="portfolio-card">
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                  alt="Web Application Development"
                />
              </div>
              <div className="portfolio-content">
                <h3>Secure Web Framework</h3>
                <p>Developed a robust web application backend with integrated security protocols, optimized database queries, and RESTful APIs.</p>
                <div className="features-list">
                  <ul>
                    <li>Secure Authentication (JWT)</li>
                    <li>Database Optimization</li>
                    <li>API Rate Limiting</li>
                  </ul>
                </div>
                <div className="tech-stack-container">
                  <span className="tech-badge web">Node.js</span>
                  <span className="tech-badge web">Express</span>
                  <span className="tech-badge web">MongoDB</span>
                </div>
              </div>
            </div>

            {/* Disaster Recovery */}
            <div className="portfolio-card">
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
                  alt="Disaster Recovery System"
                />
              </div>
              <div className="portfolio-content">
                <h3>Disaster Recovery System</h3>
                <p>Engineered a comprehensive backup and disaster recovery strategy to ensure 99.9% data availability and rapid incident response.</p>
                <div className="features-list">
                  <ul>
                    <li>Automated Backup Scripts</li>
                    <li>Risk Assessment &amp; Mitigation</li>
                    <li>Compliance Documentation</li>
                  </ul>
                </div>
                <div className="tech-stack-container">
                  <span className="tech-badge sec">Security</span>
                  <span className="tech-badge sec">Automation</span>
                </div>
              </div>
            </div>

            {/* IT Service */}
            <div className="portfolio-card">
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="IT Customer Service"
                />
              </div>
              <div className="portfolio-content">
                <h3>IT Service &amp; Support</h3>
                <p>Delivering exceptional technical support and customer service, resolving complex IT issues with a user-centric approach.</p>
                <div className="features-list">
                  <ul>
                    <li>Incident Management</li>
                    <li>Technical Troubleshooting</li>
                    <li>User Training &amp; Onboarding</li>
                  </ul>
                </div>
                <div className="tech-stack-container">
                  <span className="tech-badge svc">Jira</span>
                  <span className="tech-badge svc">ServiceNow</span>
                </div>
              </div>
            </div>

            {/* FoodEarth */}
            <a
              href="https://food-earth.vercel.app/"
              className="portfolio-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="FoodEarth Meal Planner"
                />
              </div>
              <div className="portfolio-content">
                <h3>FoodEarth</h3>
                <p>A comprehensive MVC web application addressing decision fatigue in the kitchen. Features include secure user authentication, a searchable recipe database, and an advanced weekly meal planner.</p>
                <div className="features-list">
                  <ul>
                    <li>Interactive Meal Planner</li>
                    <li>Secure Authentication (JWT)</li>
                    <li>Recipe Management (CRUD)</li>
                  </ul>
                </div>
                <div className="tech-stack-container">
                  <span className="tech-badge web">Node.js</span>
                  <span className="tech-badge web">MongoDB</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Contact Section */}
      <section id="contact" className="py-5 reveal">
        <div className="container">
          <h1 className="page-title display-5 fw-bold reveal">
            <i className="fas fa-envelope-open-text"></i> Get in <span>Touch</span>
          </h1>

          <div className="contact-wrapper">
            <div className="contact-info-panel reveal">
              <h3 className="reveal">Contact Information</h3>
              <ul className="contact-list reveal-stagger">
                <li>
                  <div className="icon"><i className="fas fa-envelope"></i></div>
                  <div className="details">
                    <strong>Email</strong>
                    <a href="mailto:balathabo96@gmail.com">balathabo96@gmail.com</a>
                  </div>
                </li>
                <li>
                  <div className="icon"><i className="fab fa-linkedin-in"></i></div>
                  <div className="details">
                    <strong>LinkedIn</strong>
                    <a href="https://www.linkedin.com/in/balachandran-thabotharan-261895131" target="_blank" rel="noopener noreferrer">balachandran-thabotharan</a>
                  </div>
                </li>
                <li>
                  <div className="icon"><i className="fab fa-github"></i></div>
                  <div className="details">
                    <strong>GitHub</strong>
                    <a href="https://github.com/balathabo1996" target="_blank" rel="noopener noreferrer">balathabo1996</a>
                  </div>
                </li>
                <li>
                  <div className="icon"><i className="fas fa-phone"></i></div>
                  <div className="details">
                    <strong>Phone</strong>
                    <a href="tel:+14373831996">(437) 383-1996</a>
                  </div>
                </li>
                <li>
                  <div className="icon"><i className="fas fa-map-marker-alt"></i></div>
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
    </>
  );
}
