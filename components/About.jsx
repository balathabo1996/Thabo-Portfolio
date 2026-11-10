/**
 * Professional Profile Section Component — components/About.jsx
 * =============================================================
 * Renders the narrative biography, technical expertise with core competency highlights & tooltips,
 * and an interactive segmented timeline (Work Experience, Education, Certifications & Voluntary).
 */

import SkillsSection from "./SkillsSection";
import ExperienceTimeline from "./ExperienceTimeline";

/**
 * About Component
 * Renders the main identity summary, interactive capabilities categories, and timeline elements.
 * 
 * @param {Object} props
 * @param {Object} [props.profile] - Primary owner profile details
 * @param {string} [props.profile.bio] - Multiline professional narrative intro
 * @param {string} [props.profile.missionTitle] - Subtitle for professional mission
 * @param {string} [props.profile.missionDescription] - Description paragraph for the mission
 * @param {Object} [props.dbSkills] - Technical skill lists categorized by type key (infra, virt, prog, db, sec, soft)
 * @param {Array} [props.achievements] - Key achievements timeline list
 * @param {Array} [props.voluntary] - Volunteer contributions timeline list
 * @param {Array} [props.educationExperience] - Academic background timeline list
 * @param {Array} [props.workExperience] - Professional employment timeline list
 */
export default function About({ 
  profile = {},
  dbSkills = {}, 
  achievements = [], 
  voluntary = [], 
  educationExperience = [],
  workExperience = []
 }) {
  const {
    bio = "Experienced Infrastructure Engineer specializing in Windows environments and virtualization.",
    missionTitle = "Professional Mission",
    missionDescription = "I am an experienced Infrastructure Engineer with over 7 years of expertise in System Administration, Virtualization, and Network Management."
  } = profile;

  return (
    <section id="about" className="py-5">
      <div className="container">
        {/* Title bar with visual icon */}
        <p className="section-kicker">01 / A LITTLE ABOUT ME</p>
        <h2 className="page-title display-5 fw-bold">
          <i className="fas fa-user-tie"></i> Professional{" "}
          <span>Profile</span>
        </h2>

        <div className="resume-section">
          {/* Intro / Summary block */}
          <div className="about-intro">
            <div className="lead">
              {/* Parse double-line spacing paragraph chunks cleanly */}
              {bio.split('\n').map((para, i) => (
                <p key={i} className={i === 0 ? "lead" : ""}>{para}</p>
              ))}
            </div>

            {/* Sub-card describing professional target values or mission goals */}
            <div className="career-goal">
              <h4>{missionTitle}</h4>
              <div className="mission-content">
                {missionDescription.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Technical Skills & Capabilities Component */}
          {Object.keys(dbSkills).length > 0 && (
            <SkillsSection dbSkills={dbSkills} />
          )}

          {/* Enhanced Segmented Timeline Component (Work, Education, Certifications & Voluntary) */}
          <ExperienceTimeline 
            workExperience={workExperience} 
            educationExperience={educationExperience}
            achievements={achievements}
            voluntary={voluntary}
          />
        </div>
      </div>
    </section>
  );
}
