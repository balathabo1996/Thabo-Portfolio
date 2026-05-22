/**
 * Portfolio Home Page Component — app/(site)/page.js
 * ===================================================
 * A Next.js React Server Component that functions as the primary website entry point.
 * Fetches all relevant details (Profile, Experiences, Projects, Skills) from MongoDB
 * server-side to enable high-performance server-side rendering (SSR).
 * Integrates interactive sub-widgets and injects JSON-LD Structured Data for search indexing.
 */

import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";
import Experience from "@/lib/models/Experience";
import Project from "@/lib/models/Project";
import Skill from "@/lib/models/Skill";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsGrid from "@/components/ProjectsGrid";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import StructuredData from "@/components/StructuredData";

// Force absolute dynamic behavior so that changes in the administrator control panel reflect instantly
export const revalidate = 0;

/**
 * Metadata configuration for the landing page.
 * Defines extensive OpenGraph and Twitter card parameters for sharing accessibility.
 */
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
        url: "https://res.cloudinary.com/dk4kvk0kw/image/upload/v1/thabo-portfolio/profileImageUrl.png",
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
    images: ["https://res.cloudinary.com/dk4kvk0kw/image/upload/v1/thabo-portfolio/profileImageUrl.png"],
  },
  icons: {
    icon: "https://img.icons8.com/ios-filled/50/000000/home.png",
    shortcut: "https://img.icons8.com/ios-filled/50/000000/home.png",
  },
};

/**
 * HomePage Server Component
 * Connects to MongoDB, gathers and filters data categories, and renders the visual layout blocks.
 * If the database connection fails, it falls back to empty values gracefully.
 */
export default async function HomePage() {
  // Initialize placeholder datasets for fallback handling
  let profileData = {};
  let achievements = [];
  let voluntary = [];
  let educationExperience = [];
  let workExperience = [];
  let dbProjects = [];
  let dbSkills = {};

  try {
    // Establish pool connection to MongoDB
    await connectToDatabase();

    // 1. Fetch Profile Document (using lean() for high performance raw JavaScript objects)
    const rawProfile = await Profile.findOne().lean();
    profileData = rawProfile ? JSON.parse(JSON.stringify(rawProfile)) : {};

    // 2. Fetch All Experiences (excluding draft entries and sorting by custom order)
    const rawExperiences = await Experience.find({ status: { $ne: "draft" } }).sort({ order: 1 }).lean();
    const allExperiences = JSON.parse(JSON.stringify(rawExperiences));
    
    // Segment experiences by taxonomy type
    achievements = allExperiences.filter((e) => e.type === "achievement");
    voluntary = allExperiences.filter((e) => e.type === "voluntary");
    educationExperience = allExperiences.filter((e) => e.type === "education");
    workExperience = allExperiences.filter((e) => e.type === "work");

    // 3. Fetch Showcase Projects (excluding draft entries and sorting by custom order)
    const rawProjects = await Project.find({ status: { $ne: "draft" } }).sort({ order: 1 }).lean();
    dbProjects = JSON.parse(JSON.stringify(rawProjects));

    // 4. Fetch Technical Skills (excluding draft entries, sorting by order, and grouping by category)
    const rawSkills = await Skill.find({ status: { $ne: "draft" } }).sort({ order: 1 }).lean();
    const skillsList = JSON.parse(JSON.stringify(rawSkills));
    
    // Group skills list array into key-value categories
    dbSkills = skillsList.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

  } catch (error) {
    // Suppress db exceptions and output warning logs in server console
    console.error("Database sync notice (using static fallbacks):", error.message);
  }

  return (
    <>
      {/* Search Engine Optimization: Injects valid JSON-LD structured data block */}
      <StructuredData profile={profileData} />
      
      {/* Hero Welcome banner section */}
      <Hero profile={profileData} />

      <div className="section-divider"></div>

      {/* Narrative Profile Section: Displays Bio, Skills, and Timeline groups */}
      <About 
        profile={profileData}
        dbSkills={dbSkills} 
        achievements={achievements} 
        voluntary={voluntary} 
        educationExperience={educationExperience}
        workExperience={workExperience}
      />

      <div className="section-divider"></div>

      {/* Case studies/projects section */}
      <ProjectsGrid dbProjects={dbProjects} />

      <div className="section-divider"></div>

      {/* Secure contact form section */}
      <ContactSection profile={profileData} />
      
      {/* ScrollReveal trigger handler for viewport fade animations */}
      <ScrollReveal />
    </>
  );
}

