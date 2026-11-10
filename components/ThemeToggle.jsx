/**
 * Dark/Light Mode Theme Toggle Button — components/ThemeToggle.jsx
 * ===============================================================
 * Renders the circular navigation header action button to toggle
 * the website's theme state between dark and light modes.
 */

'use client';
import Icon from './Icon';
import { useTheme } from './ThemeProvider';

/**
 * ThemeToggle Component
 * Interactive button executing Context theme state transitions.
 *
 * @returns {React.ReactElement} The styled toggle button JSX
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
