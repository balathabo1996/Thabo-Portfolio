import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Experience from "@/lib/models/Experience";
import Profile from "@/lib/models/Profile";
import Skill from "@/lib/models/Skill";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 1. Seed Profile
    const profileData = {
      name: "Thabotharan Balachandran",
      role: "Infrastructure Engineer | IT Solutions Student | Cybersecurity Enthusiast",
      location: "Scarborough, Ontario, Canada",
      email: "balathabo96@gmail.com",
      phone: "+1 (437) 383-1996",
      profileImageUrl: "/images/portf.png",
      bio: "Experienced IT professional specialising in infrastructure and cybersecurity.",
    };
    await Profile.findOneAndUpdate({}, profileData, { upsert: true });

    // 2. Seed Experience/Education
    await Experience.deleteMany({});
    const experiences = [
      {
        role: "IT Solutions (Graduate Certificate)",
        company: "Humber IGS",
        location: "Ontario, Canada",
        period: "Sep 2024 – Present",
        type: "education",
        order: 1,
      },
      {
        role: "Bachelor of Information and Communication Technology (Hons)",
        company: "University of Sri Jayewardenepura",
        location: "Colombo, Sri Lanka",
        period: "Aug 2016 – Apr 2021",
        type: "education",
        order: 2,
      },
      // 3. Achievements & Certifications
      {
        role: "Diploma in Information and Communication Technology",
        company: "DMI",
        type: "achievement",
        order: 1,
      },
      {
        role: "Business Communication Course",
        company: "British Council",
        type: "achievement",
        order: 2,
      },
      // 4. Voluntary Contributions
      {
        role: "Student Volunteer",
        company: "Humber International Graduate School (IGS)",
        type: "voluntary",
        order: 1,
      },
      {
        role: "Infotel Conference Volunteer",
        company: "2018",
        type: "voluntary",
        order: 2,
      },
      {
        role: "Scout Volunteer",
        company: "Temple Festival (2011)",
        type: "voluntary",
        order: 3,
      },
      {
        role: "St John’s Ambulance Volunteer",
        company: "Athletic meets (2008, 2009, 2010)",
        type: "voluntary",
        order: 4,
      },
    ];
    await Experience.insertMany(experiences);

    // 3. Seed Projects
    await Project.deleteMany({});
    const projects = [
      {
        title: "LoadFlow",
        subTitle: "Intelligent Logistics & Dispatch Orchestration",
        description:
          "Engineered a production-grade Transportation Management System (TMS) SaaS designed to replace manual spreadsheet dispatching with real-time, role-based fleet operations.",
        imageUrl: "/images/loadflow.jpg",
        period: "Jan 2026 - Apr 2026",
        features: [
          "Architecture & Security: Zero-Trust model with OWASP-compliant session management.",
          "Role-Based Dashboards: Custom flows for Admins, Dispatchers, and Drivers.",
          "Workflow Automation: Integrated Cloudinary POD and Nodemailer onboarding.",
        ],
        techStack: [
          "Next.js 15",
          "React 19",
          "TypeScript",
          "Tailwind CSS 4",
          "MongoDB",
          "Google Maps API",
        ],
        link: "https://loadflow.vercel.app",
        category: "web",
        order: 1,
      },
      {
        title: "OracleLens VPP",
        subTitle: "Virtual Power Plant (VPP) Architecture",
        award:
          '🏆 Winner: "Best Project in Information Technology" - Humber College Capstone EXPO 2026',
        description:
          "Engineered a production-ready, secure, and distributed energy architecture in collaboration with industry partner OracleLens to manage and optimize grid demand.",
        imageUrl:
          "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
        period: "Jan 2026 - Apr 2026",
        features: [
          "Distributed Architecture: Predictive energy forecasting and hardware abstraction.",
          'Backend Control Logic: Engineered the central algorithmic "Brain" for discharge targets.',
          "SCADA UI Integration: Live telemetry tracking for battery SoC and power output.",
          "Measurement & Verification (M&V): Automated digital receipts for auditing.",
          "Cybersecurity: Secure cross-machine communication bridges.",
        ],
        techStack: ["Spring Boot", "Java", "Python", "PostgreSQL", "React.js"],
        link: "https://oraclelens.com/home",
        category: "infra",
        order: 2,
      },
      {
        title: "FoodEarth",
        subTitle: "Recipe Management & Meal Planning Platform",
        description:
          "Designed and developed a full-stack MVC web application to help users discover international recipes and organize weekly meal schedules.",
        imageUrl:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        period: "Nov 2025 - Dec 2025",
        features: [
          "High-Performance Data Model: Mongoose schema with embedded documents for single-query rendering.",
          "Secure Authentication: Robust auth system using JWT and bcrypt with HttpOnly cookies.",
          "Modular Architecture: Utilized MVC patterns and Handlebars partials.",
          "Deployment: Configured and deployed to serverless environment using Vercel.",
        ],
        techStack: [
          "Node.js",
          "Express",
          "MongoDB (Mongoose)",
          "Handlebars",
          "JWT",
          "Vercel",
        ],
        link: "https://food-earth.vercel.app/",
        category: "ops",
        order: 3,
      },
      {
        title: "ICT Study Recommender",
        subTitle: "A Personalized Study Material Recommender System",
        description:
          "Designed to bridge the knowledge gap for Advanced Level ICT students by automating the delivery of study materials tailored to individual proficiency levels.",
        imageUrl:
          "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800",
        period: "Jul 2020 - Dec 2020",
        features: [
          "Adaptive Assessment: 50-question MCQ exam to determine baseline knowledge.",
          "Machine Learning Integration: K-means clustering for targeted resource delivery.",
          "Automated Recommendations: Recommendation engine serving diverse media types.",
          'Mastery-Based Progression: "Level Up" system requiring 100% on milestone quizzes.',
          "Research Impact: Achieved 100% positive response rate for GCE A/L preparation.",
        ],
        techStack: ["Laravel", "PHP", "HTML5", "JavaScript", "Bootstrap"],
        link: "#projects",
        category: "svc",
        order: 4,
      },
    ];
    await Project.insertMany(projects);

    // 4. Seed Skills
    await Skill.deleteMany({});
    const skills = [
      // Infrastructure & Operating Systems (infra)
      {
        name: "Windows Administration",
        category: "infra",
        icon: "fab fa-windows",
        order: 1,
      },
      {
        name: "Linux Administration",
        category: "infra",
        icon: "fab fa-linux",
        order: 2,
      },
      {
        name: "Cloud (GCP, AWS, Azure)",
        category: "infra",
        icon: "fas fa-cloud",
        order: 3,
      },
      {
        name: "Active Directory",
        category: "infra",
        icon: "fas fa-users-cog",
        order: 4,
      },
      {
        name: "DHCP",
        category: "infra",
        icon: "fas fa-network-wired",
        order: 5,
      },
      {
        name: "Printer Management",
        category: "infra",
        icon: "fas fa-print",
        order: 6,
      },
      {
        name: "User & Permission Management",
        category: "infra",
        icon: "fas fa-user-shield",
        order: 7,
      },
      {
        name: "Backup & Disaster Recovery",
        category: "infra",
        icon: "fas fa-save",
        order: 8,
      },
      { name: "OS Patching", category: "infra", icon: "fas fa-sync", order: 9 },

      // Virtualization & Tools (virt)
      {
        name: "Hyper-V",
        category: "virt",
        icon: "fas fa-microchip",
        order: 10,
      },
      {
        name: "VMware",
        category: "virt",
        icon: "fas fa-layer-group",
        order: 11,
      },
      { name: "Citrix", category: "virt", icon: "fas fa-desktop", order: 12 },
      {
        name: "Git / GitHub",
        category: "virt",
        icon: "fab fa-github",
        order: 13,
      },
      { name: "JIRA", category: "virt", icon: "fab fa-jira", order: 14 },
      {
        name: "ServiceNow",
        category: "virt",
        icon: "fas fa-ticket-alt",
        order: 15,
      },
      { name: "Postman", category: "virt", icon: "fas fa-vial", order: 16 },
      {
        name: "Swagger",
        category: "virt",
        icon: "fas fa-file-code",
        order: 17,
      },
      {
        name: "Tableau",
        category: "virt",
        icon: "fas fa-chart-pie",
        order: 18,
      },
      {
        name: "Microsoft Report Builder",
        category: "virt",
        icon: "fas fa-table",
        order: 19,
      },

      // Programming & Web Technologies (prog)
      { name: "JavaScript", category: "prog", icon: "fab fa-js", order: 20 },
      { name: "TypeScript", category: "prog", icon: "fas fa-code", order: 21 },
      { name: "React JS", category: "prog", icon: "fab fa-react", order: 22 },
      { name: "Next.js", category: "prog", icon: "fas fa-rocket", order: 23 },
      { name: "Angular", category: "prog", icon: "fab fa-angular", order: 24 },
      { name: "Node.js", category: "prog", icon: "fab fa-node-js", order: 25 },
      { name: "Express.js", category: "prog", icon: "fas fa-bolt", order: 26 },
      { name: "Python", category: "prog", icon: "fab fa-python", order: 27 },
      { name: "Java", category: "prog", icon: "fab fa-java", order: 28 },
      { name: "HTML / CSS", category: "prog", icon: "fab fa-html5", order: 29 },
      {
        name: "Bootstrap",
        category: "prog",
        icon: "fab fa-bootstrap",
        order: 30,
      },
      { name: "XML", category: "prog", icon: "fas fa-code", order: 31 },

      // Databases (db)
      {
        name: "Microsoft SQL Server",
        category: "db",
        icon: "fas fa-database",
        order: 32,
      },
      {
        name: "PostgreSQL",
        category: "db",
        icon: "fas fa-database",
        order: 33,
      },
      { name: "MySQL", category: "db", icon: "fas fa-database", order: 34 },
      { name: "MongoDB", category: "db", icon: "fas fa-leaf", order: 35 },

      // Security & IT Practices (sec)
      { name: "ITIL", category: "sec", icon: "fas fa-book", order: 36 },
      {
        name: "System Hardening",
        category: "sec",
        icon: "fas fa-lock",
        order: 37,
      },
      {
        name: "Security Protocols",
        category: "sec",
        icon: "fas fa-shield-alt",
        order: 38,
      },
      {
        name: "GRC & Risk Awareness",
        category: "sec",
        icon: "fas fa-exclamation-triangle",
        order: 39,
      },
      {
        name: "Documentation",
        category: "sec",
        icon: "fas fa-file-alt",
        order: 40,
      },

      // Soft Skills & Leadership (soft)
      {
        name: "Communication",
        category: "soft",
        icon: "fas fa-comments",
        order: 41,
      },
      { name: "Teamwork", category: "soft", icon: "fas fa-users", order: 42 },
      {
        name: "Adaptability",
        category: "soft",
        icon: "fas fa-sync-alt",
        order: 43,
      },
      {
        name: "Problem-Solving",
        category: "soft",
        icon: "fas fa-lightbulb",
        order: 44,
      },
      {
        name: "Leadership",
        category: "soft",
        icon: "fas fa-user-tie",
        order: 45,
      },
      {
        name: "Time Management",
        category: "soft",
        icon: "fas fa-clock",
        order: 46,
      },
      {
        name: "Crisis Management",
        category: "soft",
        icon: "fas fa-fire-extinguisher",
        order: 47,
      },
    ];
    await Skill.insertMany(skills);

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
