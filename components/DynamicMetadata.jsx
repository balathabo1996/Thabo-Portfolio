/**
 * DynamicMetadata  —  components/DynamicMetadata.jsx
 * ====================================================
 * Client component that updates the browser tab title and favicon in real time
 * as the user scrolls between the one-page sections.
 *
 * How it works:
 *   1. A scroll listener fires requestAnimationFrame on every scroll event.
 *   2. Each section's bounding rect is compared to the top third of the viewport.
 *   3. The last section whose top edge has passed that threshold is "active".
 *   4. The <title> tag and all <link rel="icon"> / <link rel="shortcut icon">
 *      elements are replaced to reflect the active section's title and icon.
 *
 * Sections tracked:  Home · About · Portfolio · Contact
 *
 * Renders nothing to the DOM — side-effects only.
 */
'use client';
import { useEffect } from 'react';

const metadataMap = {
  home: {
    title: 'Home | Thabo.Portfolio',
    icon: 'https://img.icons8.com/ios-filled/50/000000/home.png'
  },
  about: {
    title: 'About | Thabo.Portfolio',
    icon: 'https://img.icons8.com/ios-filled/50/000000/user.png'
  },
  portfolio: {
    title: 'Portfolio | Thabo.Portfolio',
    icon: 'https://img.icons8.com/ios-filled/50/000000/briefcase.png'
  },
  contact: {
    title: 'Contact | Thabo.Portfolio',
    icon: 'https://img.icons8.com/ios-filled/50/000000/mail.png'
  }
};

export default function DynamicMetadata() {
  useEffect(() => {
    const sections = ['home', 'about', 'portfolio', 'contact'];
    
    const updateMetadata = () => {
      let currentSection = 'home';
      
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            currentSection = section;
          }
        }
      });

      const { title, icon } = metadataMap[currentSection];
      
      // Update Title
      if (document.title !== title) {
        document.title = title;
      }

      // Update Favicon (Force refresh by removing and recreating multiple types)
      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      const currentIcon = existingFavicons[0]?.getAttribute('href');

      if (currentIcon !== icon) {
        // Update existing favicon tags instead of removing them
        const existingFavicons = document.querySelectorAll("link[rel*='icon']");
        
        if (existingFavicons.length > 0) {
          existingFavicons.forEach(el => {
            el.setAttribute('href', icon);
          });
        } else {
          // If no favicon exists, create one safely
          const head = document.getElementsByTagName('head')[0];
          if (head) {
            const newIcon = document.createElement('link');
            newIcon.rel = 'icon';
            newIcon.href = icon;
            head.appendChild(newIcon);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollEvent);
    
    function handleScrollEvent() {
      requestAnimationFrame(updateMetadata);
    }

    updateMetadata();
    const timer = setTimeout(updateMetadata, 1000);

    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
