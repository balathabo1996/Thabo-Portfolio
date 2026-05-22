/**
 * Contact Section Component — components/ContactSection.jsx
 * =========================================================
 * Displays the contact methods, phone number, email, locations, and social links
 * retrieved from the profile. Includes the interactive client-side ContactForm.
 */

import ContactForm from "./ContactForm";

/**
 * ContactSection Component
 * Renders the structural layout for the contact panel containing personal details
 * and the submission form.
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile object containing contact information
 * @param {string} [props.profile.email] - Contact email address
 * @param {string} [props.profile.linkedinUrl] - URL of LinkedIn profile
 * @param {string} [props.profile.githubUrl] - URL of GitHub profile
 * @param {string} [props.profile.phone] - Contact telephone number
 * @param {string} [props.profile.location] - Geographical location address
 * @returns {React.ReactElement} The styled ContactSection component
 */
export default function ContactSection({ profile = {} }) {
  return (
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
              {profile.email && (
                <li>
                  <div className="icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="details">
                    <strong>Email</strong>
                    <a href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  </div>
                </li>
              )}
              {profile.linkedinUrl && (
                <li>
                  <div className="icon">
                    <i className="fab fa-linkedin-in"></i>
                  </div>
                  <div className="details">
                    <strong>LinkedIn</strong>
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.linkedinUrl.split('/').pop()}
                    </a>
                  </div>
                </li>
              )}
              {profile.githubUrl && (
                <li>
                  <div className="icon">
                    <i className="fab fa-github"></i>
                  </div>
                  <div className="details">
                    <strong>GitHub</strong>
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.githubUrl.split('/').pop()}
                    </a>
                  </div>
                </li>
              )}
              {profile.phone && (
                <li>
                  <div className="icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="details">
                    <strong>Phone</strong>
                    <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                  </div>
                </li>
              )}
              {profile.location && (
                <li>
                  <div className="icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="details">
                    <strong>Location</strong>
                    <p>{profile.location}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="contact-form reveal">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
