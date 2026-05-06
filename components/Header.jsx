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
export default function Header() {
  const [activeSection, setActiveSection] = useState('home');

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

  return (
    <header>
      <Link href="/#" className="logo" onClick={() => setActiveSection('home')}>
        <span>T</span>habo.
      </Link>
      <nav className="navigation">
        <Link 
          href="/#" 
          className={activeSection === 'home' ? 'active' : ''}
          onClick={() => setActiveSection('home')}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link 
          href="/#about" 
          className={activeSection === 'about' ? 'active' : ''}
          onClick={() => setActiveSection('about')}
        >
          <i className="fas fa-user"></i>
          <span>About</span>
        </Link>
        <Link 
          href="/#projects" 
          className={activeSection === 'projects' ? 'active' : ''}
          onClick={() => setActiveSection('projects')}
        >
          <i className="fas fa-code"></i>
          <span>Projects</span>
        </Link>
        <Link 
          href="/#contact" 
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
