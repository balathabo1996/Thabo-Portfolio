import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";
import Experience from "@/lib/models/Experience";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thabo.Projects | Thabotharan Balachandran",
  description:
    "Portfolio of Thabotharan Balachandran, an experienced Infrastructure Engineer & IT Professional specializing in System Administration and Web Development.",
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

  } catch (error) {
    // Silently log error to server console; page continues with defaults
    console.error("Database sync notice (using static fallbacks):", error.message);
  }

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
                <a
                  href="https://www.linkedin.com/in/balachandran-thabotharan-261895131"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Balachandran Thabotharan
                </a>
              </span>
              <span className="separator">|</span>
              <span className="contact-item">
                <i className="fab fa-github"></i>
                <a
                  href="https://github.com/balathabo1996"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  balathabo1996
                </a>
              </span>
            </div>
          </div>

          <p className="hero-description-text">
            Leveraging expertise in Windows environments, virtualization, and
            security to deliver scalable IT solutions.
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

            {/* Skills Section */}
            <div className="section-header reveal">
              <h2>Technical Expertise</h2>
              <div className="section-line"></div>
            </div>

            <div className="skills-grid reveal-stagger">
              <div className="skill-category infra">
                <h3>Infrastructure &amp; Operating Systems</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">
                    Windows Administration
                  </span>
                  <span className="badge rounded-pill">
                    Linux Administration
                  </span>
                  <span className="badge rounded-pill">
                    Cloud (GCP, AWS, Azure)
                  </span>
                  <span className="badge rounded-pill">Active Directory</span>
                  <span className="badge rounded-pill">DHCP</span>
                  <span className="badge rounded-pill">Printer Management</span>
                  <span className="badge rounded-pill">
                    User &amp; Permission Management
                  </span>
                  <span className="badge rounded-pill">
                    Backup &amp; Disaster Recovery
                  </span>
                  <span className="badge rounded-pill">OS Patching</span>
                </div>
              </div>
              <div className="skill-category virt">
                <h3>Virtualization &amp; Tools</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">Hyper-V</span>
                  <span className="badge rounded-pill">VMware</span>
                  <span className="badge rounded-pill">Citrix</span>
                  <span className="badge rounded-pill">Git / GitHub</span>
                  <span className="badge rounded-pill">JIRA</span>
                  <span className="badge rounded-pill">ServiceNow</span>
                  <span className="badge rounded-pill">Postman (Automated Testing)</span>
                  <span className="badge rounded-pill">Swagger (OpenAPI 3.1)</span>
                  <span className="badge rounded-pill">Tableau</span>
                  <span className="badge rounded-pill">
                    Microsoft Report Builder
                  </span>
                </div>
              </div>
              <div className="skill-category prog">
                <h3>Programming &amp; Web Technologies</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">JavaScript</span>
                  <span className="badge rounded-pill">React JS</span>
                  <span className="badge rounded-pill">Angular</span>
                  <span className="badge rounded-pill">Node.js</span>
                  <span className="badge rounded-pill">Express</span>
                  <span className="badge rounded-pill">Java</span>
                  <span className="badge rounded-pill">HTML / CSS</span>
                  <span className="badge rounded-pill">Bootstrap</span>
                  <span className="badge rounded-pill">XML</span>
                </div>
              </div>
              <div className="skill-category db">
                <h3>Databases</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">
                    Microsoft SQL Server
                  </span>
                  <span className="badge rounded-pill">PostgreSQL</span>
                  <span className="badge rounded-pill">MySQL</span>
                  <span className="badge rounded-pill">MongoDB</span>
                </div>
              </div>
              <div className="skill-category sec">
                <h3>Security &amp; IT Practices</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">ITIL</span>
                  <span className="badge rounded-pill">System Hardening</span>
                  <span className="badge rounded-pill">Security Protocols</span>
                  <span className="badge rounded-pill">
                    GRC &amp; Risk Awareness
                  </span>
                  <span className="badge rounded-pill">Documentation</span>
                </div>
              </div>
              <div className="skill-category soft">
                <h3>Soft Skills &amp; Leadership</h3>
                <div className="skill-tags">
                  <span className="badge rounded-pill">Team Leadership</span>
                  <span className="badge rounded-pill">Troubleshooting</span>
                  <span className="badge rounded-pill">Crisis Management</span>
                  <span className="badge rounded-pill">
                    Cross-functional Collaboration
                  </span>
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
                    <li>
                      Manage daily fuel expense tracking for fleet operations,
                      monitoring fuel usage, costs, and identifying
                      opportunities to optimize fuel consumption.
                    </li>
                    <li>
                      Coordinate with fuel suppliers to ensure competitive
                      pricing and uninterrupted fuel availability for fleet
                      vehicles.
                    </li>
                    <li>
                      Conduct and maintain records of truck safety inspections,
                      ensuring compliance with transportation safety standards
                      and regulations.
                    </li>
                    <li>
                      Schedule and track vehicle maintenance activities to
                      reduce breakdown risks and improve operational
                      reliability.
                    </li>
                    <li>
                      Support driver safety initiatives by assisting with safety
                      training coordination and incident follow-ups.
                    </li>
                    <li>
                      Utilize fleet management software to monitor vehicle
                      performance, maintenance requirements, and operational
                      data.
                    </li>
                    <li>
                      Prepare detailed fuel, safety, and performance reports for
                      management review and decision-making.
                    </li>
                    <li>
                      Handle invoicing and billing operations, including
                      verification of trip details such as mileage, fuel
                      charges, detention hours, and accessorial fees.
                    </li>
                    <li>
                      Track payments, manage outstanding invoices, and
                      coordinate with accounting teams to ensure accurate
                      financial reconciliation.
                    </li>
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
                      <span className="location">
                        Toronto, Ontario, Canada (Remote)
                      </span>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <strong>Award:</strong> Awarded "Best Project in
                      Information Technology Solutions" at the Humber College
                      Capstone EXPO for engineering a distributed Virtual Power
                      Plant (VPP) architecture in collaboration with industry
                      sponsor OracleLens.
                    </li>
                    <li>
                      <strong>Systems Architecture:</strong> Engineered a
                      secure, containerized control plane that integrated
                      real-time grid communication, predictive energy
                      forecasting, and physical hardware abstraction into a
                      single cohesive platform.
                    </li>
                    <li>
                      <strong>Backend Dispatch Logic:</strong> Developed the
                      central algorithmic "Brain" to ingest percentage-based
                      load shed signals and calculate precise, physically
                      constrained kW discharge targets for simulated energy
                      assets.
                    </li>
                    <li>
                      <strong>SCADA UI Development:</strong> Built a real-time
                      Human-Machine Interface (HMI) to visually orchestrate
                      dispatch events, mapping backend control logic to live
                      dashboard animations of battery State of Charge (SoC) and
                      power output.
                    </li>
                    <li>
                      <strong>Measurement &amp; Verification (M&amp;V):</strong>{" "}
                      Implemented a high-fidelity telemetry logging pipeline to
                      generate immutable digital receipts (baseline kW,
                      delivered kWh, timestamps) required for grid performance
                      verification.
                    </li>
                    <li>
                      <strong>Network Security:</strong> Established secure
                      cross-machine communication bridges utilizing
                      cryptographic key management to ensure authenticated
                      messaging across the distributed network.
                    </li>
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
                    <li>
                      Designed and implemented Windows-based infrastructure
                      solutions aligned with organizational needs, ensuring
                      scalability, security, and optimal performance.
                    </li>
                    <li>
                      Deployed and configured Windows servers and workstations,
                      including Active Directory, user accounts, permissions,
                      and network configurations.
                    </li>
                    <li>
                      Utilized virtualization technologies such as Hyper-V and
                      VMware to improve infrastructure efficiency.
                    </li>
                    <li>
                      Implemented backup strategies and disaster recovery plans
                      to protect critical data and minimize downtime.
                    </li>
                    <li>
                      Maintained detailed technical documentation for system
                      configurations and troubleshooting procedures.
                    </li>
                    <li>
                      Applied industry-standard security practices to protect
                      systems from vulnerabilities and threats.
                    </li>
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
                    <li>
                      Publicized effective collaboration with front-end
                      developers, integrating user-facing elements with
                      server-side logic for an enhanced user experience.
                    </li>
                    <li>
                      Improved application performance by fine-tuning database
                      queries and server processes.
                    </li>
                    <li>
                      Participated in code reviews, delivering constructive
                      feedback to maintain high code quality and adherence to
                      best practices.
                    </li>
                    <li>
                      Collaborated with cross-functional teams, including UI/UX
                      designers and product managers, ensuring timely and
                      successful project delivery.
                    </li>
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
                    <li>
                      Provided exceptional customer service, resolving inquiries
                      and issues with a positive and professional approach.
                    </li>
                    <li>
                      Gained valuable insights into banking operations,
                      processing transactions, and updating customer information
                      while adhering to policies.
                    </li>
                    <li>
                      Synthesized risk management efforts, assisting in
                      identifying potential operational risks.
                    </li>
                    <li>
                      Ensured compliance with banking regulations and legal
                      requirements, fostering a well-regulated environment.
                    </li>
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
                      <h3
                        style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                      >
                        {item.role}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.company}
                      </p>
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
                      <h3
                        style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                      >
                        {item.role}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.company}
                      </p>
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
            {/* LoadFlow */}
            <a
              href="https://loadflow.vercel.app"
              className="portfolio-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="portfolio-img-wrapper">
                <img
                  src="/images/loadflow.jpg"
                  alt="LoadFlow Trucking Logistics Platform"
                />
                <div className="portfolio-date">Jan 2026 - Apr 2026</div>
              </div>
              <div className="portfolio-content">
                <div className="portfolio-header">
                  <h3>LoadFlow</h3>
                </div>
                <p className="project-title-ext">Intelligent Logistics & Dispatch Orchestration</p>
                <p className="project-desc">
                  Engineered a production-grade Transportation Management System (TMS) SaaS designed to replace manual spreadsheet dispatching with real-time, role-based fleet operations.
                </p>
                <div className="features-list">
                  <ul>
                    <li>
                      <strong>Architecture & Security:</strong> Architected a Zero-Trust security model utilizing OWASP-compliant session management, HttpOnly JWT cookies, and custom "Hard Revocation".
                    </li>
                    <li>
                      <strong>Role-Based Dashboards:</strong> Developed custom UI flows for Admins (audit logging), Dispatchers (multi-stop route creation), and Drivers (mobile-first tracking).
                    </li>
                    <li>
                      <strong>Workflow Automation:</strong> Integrated Cloudinary for instant Proof of Delivery (POD) and a secure, Nodemailer-powered automated driver onboarding pipeline.
                    </li>
                    <li>
                      <strong>Modern Tech Stack:</strong> Built using Next.js 15, React 19, TypeScript, Tailwind CSS 4, and MongoDB Atlas.
                    </li>
                  </ul>
                </div>
                <div className="tech-stack-container" style={{ flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                  <span className="tech-badge web">Next.js 15</span>
                  <span className="tech-badge web">React 19</span>
                  <span className="tech-badge web">TypeScript</span>
                  <span className="tech-badge web">Tailwind CSS 4</span>
                  <span className="tech-badge web">MongoDB</span>
                  <span className="tech-badge web">Google Maps API</span>
                </div>
              </div>
            </a>

            {/* OracleLens VPP */}
            <a
              href="https://oraclelens.com/home"
              className="portfolio-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80"
                  alt="OracleLens Virtual Power Plant"
                />
                <div className="portfolio-date">Jan 2026 - Apr 2026</div>
              </div>
              <div className="portfolio-content">
                <div className="portfolio-header">
                  <h3>OracleLens VPP</h3>
                </div>
                <p className="project-title-ext">
                  Virtual Power Plant (VPP) Architecture
                </p>
                <p className="project-award">
                  🏆 <strong>Winner:</strong> "Best Project in Information
                  Technology" - Humber College Capstone EXPO 2026
                </p>
                <p className="project-desc">
                  Engineered a production-ready, secure, and distributed energy
                  architecture in collaboration with industry partner OracleLens
                  to manage and optimize grid demand.
                </p>
                <div className="features-list">
                  <ul>
                    <li>
                      <strong>Distributed Architecture:</strong> Integrated
                      real-time grid communication, predictive energy
                      forecasting, and physical hardware abstraction into a
                      single cohesive platform.
                    </li>
                    <li>
                      <strong>Backend Control Logic:</strong> Engineered the
                      central algorithmic "Brain" to calculate precise,
                      physically constrained power discharge targets from
                      automated grid signals.
                    </li>
                    <li>
                      <strong>SCADA UI Integration:</strong> Developed a
                      real-time visualization dashboard tracking live telemetry
                      such as battery State of Charge (SoC) and active power
                      output.
                    </li>
                    <li>
                      <strong>Measurement &amp; Verification (M&amp;V):</strong>{" "}
                      Implemented an automated telemetry logging pipeline to
                      generate immutable "digital receipts" for grid performance
                      auditing.
                    </li>
                    <li>
                      <strong>Cybersecurity:</strong> Established secure
                      cross-machine communication bridges to ensure
                      authenticated messaging across the distributed network.
                    </li>
                  </ul>
                </div>
                <div
                  className="tech-stack-container"
                  style={{ flexWrap: "wrap", gap: "8px", marginTop: "15px" }}
                >
                  <span className="tech-badge infra">Spring Boot</span>
                  <span className="tech-badge infra">Java</span>
                  <span className="tech-badge infra">Python</span>
                  <span className="tech-badge infra">PostgreSQL</span>
                  <span className="tech-badge infra">React.js</span>
                </div>
              </div>
            </a>

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
                <div className="portfolio-date">Nov 2025 - Dec 2025</div>
              </div>
              <div className="portfolio-content">
                <div className="portfolio-header">
                  <h3>FoodEarth</h3>
                </div>
                <p className="project-title-ext">
                  Recipe Management & Meal Planning Platform
                </p>
                <p className="project-desc">
                  Designed and developed a full-stack MVC web application to
                  help users discover international recipes and organize weekly
                  meal schedules.
                </p>
                <div className="features-list">
                  <ul>
                    <li>
                      <strong>High-Performance Data Model:</strong> Designed a
                      Mongoose schema utilizing embedded documents for the Meal
                      Planner feature, reducing database calls and enabling
                      single-query dashboard rendering.
                    </li>
                    <li>
                      <strong>Secure Authentication:</strong> Built a robust
                      auth system using JSON Web Tokens (JWT) and bcrypt,
                      storing tokens in HTTP-Only cookies to prevent XSS
                      attacks.
                    </li>
                    <li>
                      <strong>Modular Architecture:</strong> Utilized MVC
                      patterns and Handlebars partials to create a reusable,
                      maintainable codebase and a responsive frontend UI.
                    </li>
                    <li>
                      <strong>Deployment:</strong> Configured and deployed the
                      application to a serverless environment using Vercel.
                    </li>
                  </ul>
                </div>
                <div
                  className="tech-stack-container"
                  style={{ flexWrap: "wrap", gap: "8px", marginTop: "15px" }}
                >
                  <span className="tech-badge ops">Node.js</span>
                  <span className="tech-badge ops">Express</span>
                  <span className="tech-badge ops">MongoDB (Mongoose)</span>
                  <span className="tech-badge ops">Handlebars</span>
                  <span className="tech-badge ops">JWT</span>
                  <span className="tech-badge ops">Vercel</span>
                </div>
              </div>
            </a>

            {/* ICT Recommender */}
            <a
              href="#projects"
              className="portfolio-card"
            >
              <div className="portfolio-img-wrapper">
                <img
                  src="https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="ICT Study Material Recommender System"
                />
                <div className="portfolio-date">Jul 2020 - Dec 2020</div>
              </div>
              <div className="portfolio-content">
                <div className="portfolio-header">
                  <h3>ICT Study Recommender</h3>
                </div>
                <p className="project-title-ext">A Personalized Study Material Recommender System for Advanced Level ICT Students</p>
                <p className="project-desc">
                  Designed to bridge the knowledge gap for Advanced Level ICT students by automating the delivery of study materials tailored to individual proficiency levels.
                </p>
                <div className="features-list">
                  <ul>
                    <li>
                      <strong>Adaptive Assessment:</strong> Built an initial evaluation module consisting of a 50-question MCQ exam to determine a student's baseline knowledge.
                    </li>
                    <li>
                      <strong>Machine Learning Integration:</strong> Implemented the K-means clustering algorithm to categorize learners into Basic, Middle, and High-level groups for targeted resource delivery.
                    </li>
                    <li>
                      <strong>Automated Recommendations:</strong> Developed a recommendation engine that serves diverse media types (PDFs, videos, presentations) based on the user's specific cluster.
                    </li>
                    <li>
                      <strong>Mastery-Based Progression:</strong> Created a "Level Up" system requiring students to achieve 100% on milestone quizzes before accessing advanced curriculum.
                    </li>
                    <li>
                      <strong>Research Impact:</strong> Achieved a 100% positive response rate from surveyed students regarding the implementation to support GCE A/L preparation.
                    </li>
                  </ul>
                </div>
                <div className="tech-stack-container" style={{ flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                  <span className="tech-badge svc">Laravel</span>
                  <span className="tech-badge svc">PHP</span>
                  <span className="tech-badge svc">HTML5</span>
                  <span className="tech-badge svc">JavaScript</span>
                  <span className="tech-badge svc">Bootstrap</span>
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
    </>
  );
}
