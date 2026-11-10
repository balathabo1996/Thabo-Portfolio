/**
 * Header / Navigation Bar  —  components/Header.jsx
 * ===================================================
 * Sticky top navigation rendered on every page through the Root Layout.
 *
 * Scroll-tracking:
 *   A scroll event listener compares each section's bounding rect to the top
 *   third of the viewport. The last section whose top edge has crossed that
 *   threshold is considered "active", and its corresponding nav link receives
 *   the .active class for visual highlighting.
 *
 * Sections tracked:  Home · About · Portfolio · Contact
 *
 * The logo and nav links use anchor-style hash hrefs (/#, /#about, etc.) so
 * the browser performs a smooth scroll to the correct section on click.
 */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Header Component
 * Renders the primary navigation bar.
 * Connects hash scroll positions to trigger active status animations on layout links.
 * Hidden in admin layouts.
 *
 * @returns {React.ReactElement|null} The styled Header component or null if in admin view
 */
export default function Header() {
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();



  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'contact'];
    
    const handleScroll = () => {
      let currentSection = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Detect if section is taking up a significant part of the top viewport
          if (rect.top <= window.innerHeight / 3) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/admin') return null;

  return (
    <header>
      <Link 
        href="/#home" 
        className="logo brand-wordmark"
        aria-label="Thabo portfolio home"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          setActiveSection('home');
          window.history.pushState(null, null, '/#home');
        }}
      >
        <span className="brand-initial">T</span>habo<span className="brand-dot">.</span>
      </Link>
      <nav className="navigation" aria-label="Main navigation">
        <Link 
          href="/#home" 
          aria-label="Home"
          aria-current={activeSection === 'home' ? 'location' : undefined}
          className={activeSection === 'home' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
            setActiveSection('home');
            window.history.pushState(null, null, '/#home');
          }}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link 
          href="/#about" 
          aria-label="About"
          aria-current={activeSection === 'about' ? 'location' : undefined}
          className={activeSection === 'about' ? 'active' : ''}
          onClick={() => setActiveSection('about')}
        >
          <i className="fas fa-user"></i>
          <span>About</span>
        </Link>
        <Link 
          href="/#projects" 
          aria-label="Projects"
          aria-current={activeSection === 'projects' ? 'location' : undefined}
          className={activeSection === 'projects' ? 'active' : ''}
          onClick={() => setActiveSection('projects')}
        >
          <i className="fas fa-code"></i>
          <span>Projects</span>
        </Link>
        <Link 
          href="/#contact" 
          aria-label="Contact"
          aria-current={activeSection === 'contact' ? 'location' : undefined}
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={() => setActiveSection('contact')}
        >
          <i className="fas fa-paper-plane"></i>
          <span>Contact</span>
        </Link>
      </nav>
    </header>
  );
}
