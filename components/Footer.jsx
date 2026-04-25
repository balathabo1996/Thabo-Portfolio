/**
 * Footer  —  components/Footer.jsx
 * ==================================
 * Site-wide footer rendered on every page through the Root Layout.
 * Contains social / contact icon links:
 *   - Email (mailto)
 *   - LinkedIn (external, noopener noreferrer)
 *   - GitHub  (external, noopener noreferrer)
 * and a copyright notice.
 */
export default function Footer() {
  return (
    <footer>
      <div className="social-links">
        <a href="mailto:balathabo96@gmail.com" aria-label="Email">
          <i className="fas fa-envelope"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/balachandran-thabotharan-261895131"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a
          href="https://github.com/balathabo1996"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <i className="fab fa-github"></i>
        </a>
      </div>
      <p>&copy; 2025 Thabotharan Balachandran. All rights reserved.</p>
    </footer>
  );
}
