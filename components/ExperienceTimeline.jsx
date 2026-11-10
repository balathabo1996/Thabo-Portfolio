/**
 * Experience & Education Segmented Timeline Component — components/ExperienceTimeline.jsx
 * ========================================================================================
 * Features:
 *   - Segmented Tab Pills: [ Work Experience ] | [ Education ] | [ Certifications & Voluntary ]
 *   - Visual Company & Institution Badges: Replaces simple dots with 44px glass nodes & domain icons
 *     (e.g., fas fa-server for Infrastructure, fas fa-graduation-cap for Education, fas fa-award)
 *   - Guaranteed immediate visibility with smooth CSS transitions across tab switches
 *   - Clean company links with external indicators
 *   - Date and location meta tags with calendar and map icons
 *   - Expandable bullet points for lengthy job descriptions to keep cards scannable
 */

'use client';

import { useState } from 'react';

/**
 * Intelligent icon resolver based on role, company, and category type
 */
function getNodeIcon(item = {}, type = 'work') {
  const role = (item.role || '').toLowerCase();
  const company = (item.company || '').toLowerCase();

  if (type === 'education') {
    if (role.includes('web') || role.includes('software') || role.includes('computer')) {
      return 'fas fa-laptop-code';
    }
    return 'fas fa-graduation-cap';
  }

  if (type === 'achievement') {
    return 'fas fa-award';
  }

  if (type === 'voluntary') {
    return 'fas fa-hands-helping';
  }

  // Work experience heuristics
  if (role.includes('infrastructure') || role.includes('server') || role.includes('system') || role.includes('sysadmin')) {
    return 'fas fa-server';
  }
  if (role.includes('network') || role.includes('cloud') || role.includes('azure') || role.includes('telecom')) {
    return 'fas fa-network-wired';
  }
  if (role.includes('security') || role.includes('compliance') || role.includes('risk')) {
    return 'fas fa-shield-alt';
  }
  if (role.includes('web') || role.includes('developer') || role.includes('engineer') || role.includes('frontend')) {
    return 'fas fa-code';
  }

  return 'fas fa-briefcase';
}

/**
 * Individual Timeline Card Item
 */
function TimelineCard({ item, type, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const iconClass = getNodeIcon(item, type);
  const descriptionList = item.description || [];
  const hasManyPoints = descriptionList.length > 3;
  const visiblePoints = isExpanded || !hasManyPoints ? descriptionList : descriptionList.slice(0, 3);

  return (
    <div className={`timeline-item timeline-type-${type}`}>
      {/* 44px Visual Domain / Company Node Badge centered on vertical track */}
      <div className="timeline-node" title={item.role || 'Timeline milestone'}>
        <i className={iconClass}></i>
      </div>

      <div className="resume-card">
        <div className="card-header">
          <div className="role-info">
            <h3>{item.role}</h3>
            <h4>
              {item.companyUrl ? (
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-link d-inline-flex align-items-center gap-1"
                >
                  <span>{item.company}</span>
                  <i className="fas fa-external-link-alt company-ext-icon"></i>
                </a>
              ) : (
                <span>{item.company}</span>
              )}
            </h4>
          </div>

          <div className="meta-info">
            {item.period && (
              <span className="date-badge">
                <i className="far fa-calendar-alt me-1"></i>
                {item.period}
              </span>
            )}
            {item.location && (
              <span className="location">
                <i className="fas fa-map-marker-alt me-1 text-accent"></i>
                {item.location}
              </span>
            )}
          </div>
        </div>

        {/* Bullet points outlining responsibilities or achievements */}
        {descriptionList.length > 0 && (
          <div className="timeline-content-body">
            <ul>
              {visiblePoints.map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>

            {/* Expand / Collapse toggle for long descriptions */}
            {hasManyPoints && (
              <button
                type="button"
                className="btn-toggle-bullets"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? 'Show less' : `+ Show ${descriptionList.length - 3} more highlights`}</span>
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ms-1`}></i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main ExperienceTimeline Component
 */
export default function ExperienceTimeline({
  workExperience = [],
  educationExperience = [],
  achievements = [],
  voluntary = []
}) {
  const [activeTab, setActiveTab] = useState('work');

  const tabs = [
    {
      id: 'work',
      label: 'Work Experience',
      icon: 'fas fa-briefcase',
      count: workExperience.length
    },
    {
      id: 'education',
      label: 'Education',
      icon: 'fas fa-graduation-cap',
      count: educationExperience.length
    },
    {
      id: 'credentials',
      label: 'Certifications & Voluntary',
      icon: 'fas fa-award',
      count: achievements.length + voluntary.length
    }
  ];

  return (
    <div className="timeline-section-wrapper mt-5">
      {/* Section Header */}
      <div className="section-header">
        <div>
          <h2>Career &amp; Academic Timeline</h2>
          <p className="section-subtitle">
            Explore practical engineering experience, academic degrees, and community contributions
          </p>
        </div>
        <div className="section-line"></div>
      </div>

      {/* Segmented Control Pill Bar */}
      <div className="timeline-tabs-nav" role="tablist" aria-label="Timeline sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`timeline-panel-${tab.id}`}
            id={`timeline-tab-${tab.id}`}
            className={`timeline-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`${tab.icon} me-1`}></i>
            <span className="tab-label">{tab.label}</span>
            <span className="timeline-tab-badge">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="timeline-tab-content">
        {/* 1. Work Experience Tab */}
        {activeTab === 'work' && (
          <div
            id="timeline-panel-work"
            role="tabpanel"
            aria-labelledby="timeline-tab-work"
            className="timeline-panel-active"
          >
            <div className="timeline">
              {workExperience.length > 0 ? (
                workExperience.map((exp, index) => (
                  <TimelineCard key={index} item={exp} type="work" index={index} />
                ))
              ) : (
                <div className="timeline-empty-card">
                  <i className="fas fa-briefcase text-muted mb-2"></i>
                  <p>No professional experience records found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Education Tab */}
        {activeTab === 'education' && (
          <div
            id="timeline-panel-education"
            role="tabpanel"
            aria-labelledby="timeline-tab-education"
            className="timeline-panel-active"
          >
            <div className="timeline">
              {educationExperience.length > 0 ? (
                educationExperience.map((edu, index) => (
                  <TimelineCard key={index} item={edu} type="education" index={index} />
                ))
              ) : (
                <div className="timeline-empty-card">
                  <i className="fas fa-graduation-cap text-muted mb-2"></i>
                  <p>No education records found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Certifications & Voluntary Tab */}
        {activeTab === 'credentials' && (
          <div
            id="timeline-panel-credentials"
            role="tabpanel"
            aria-labelledby="timeline-tab-credentials"
            className="timeline-panel-active"
          >
            {/* Key Achievements & Honors Subsection */}
            {achievements.length > 0 && (
              <div className="subsection-block mb-5">
                <div className="subsection-header d-flex align-items-center gap-2 mb-4">
                  <div className="subsection-icon-badge">
                    <i className="fas fa-trophy text-warning"></i>
                  </div>
                  <h3 className="subsection-title mb-0">Key Achievements &amp; Certifications</h3>
                </div>

                <div className="timeline">
                  {achievements.map((item, index) => (
                    <TimelineCard key={index} item={item} type="achievement" index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Voluntary Subsection */}
            {voluntary.length > 0 && (
              <div className="subsection-block">
                <div className="subsection-header d-flex align-items-center gap-2 mb-4">
                  <div className="subsection-icon-badge">
                    <i className="fas fa-hands-helping text-info"></i>
                  </div>
                  <h3 className="subsection-title mb-0">Voluntary Contributions &amp; Community</h3>
                </div>

                <div className="timeline">
                  {voluntary.map((item, index) => (
                    <TimelineCard key={index} item={item} type="voluntary" index={index} />
                  ))}
                </div>
              </div>
            )}

            {achievements.length === 0 && voluntary.length === 0 && (
              <div className="timeline-empty-card">
                <i className="fas fa-award text-muted mb-2"></i>
                <p>No certifications or voluntary records available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
