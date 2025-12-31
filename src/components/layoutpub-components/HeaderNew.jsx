import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavLanguage from './NavLanguage';
import { LOGO } from '../../configs/AppConfig';
import IntlMessage from '../util-components/IntlMessage';

/**
 * HeaderNew Component - Top-tier design
 *
 * Features:
 * - Sticky header with white background (always)
 * - Shadow on scroll for depth effect
 * - Functional mobile hamburger menu
 * - Smooth animations
 * - Correct logo link (/guide/pub/home)
 * - Responsive design
 * - Accessibility support
 */
const HeaderNew = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for shadow
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    router.events?.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`civiglio-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <div className="header-logo">
              <Link href="/guide/pub/home">
                <img src={LOGO} alt="Civiglio" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="header-nav desktop-nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link href="/guide/pub/home">
                    <IntlMessage id="home" />
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    href="https://www.guides4you.it/contattaci/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IntlMessage id="header.contact" />
                  </a>
                </li>
                <li className="nav-item">
                  <Link href="/app">
                    <IntlMessage id="login" />
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Language Switcher */}
            <div className="header-actions">
              <NavLanguage configDisplay={true} />

              {/* Mobile Menu Toggle */}
              <button
                className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu">
          {/* Mobile Menu Header */}
          <div className="mobile-menu-header">
            <Link href="/guide/pub/home" onClick={closeMobileMenu}>
              <img src={LOGO} alt="Civiglio" className="mobile-logo" />
            </Link>
            <button
              className="close-menu"
              onClick={closeMobileMenu}
              aria-label="Chiudi menu"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              <li className="mobile-nav-item">
                <Link href="/guide/pub/home" onClick={closeMobileMenu}>
                  <i className="fa fa-home"></i>
                  <IntlMessage id="home" />
                </Link>
              </li>
              <li className="mobile-nav-item">
                <a
                  href="https://www.guides4you.it/contattaci/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                >
                  <i className="fa fa-envelope"></i>
                  <IntlMessage id="header.contact" />
                </a>
              </li>
              <li className="mobile-nav-item">
                <Link href="/app" onClick={closeMobileMenu}>
                  <i className="fa fa-sign-in"></i>
                  <IntlMessage id="login" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Language Switcher */}
          <div className="mobile-language">
            <NavLanguage configDisplay={true} />
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ========== Header Container (Always White) ========== */
        .civiglio-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #ffffff;
          transition: box-shadow 0.3s ease;
        }

        .civiglio-header.scrolled {
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        /* ========== Logo ========== */
        .header-logo {
          flex-shrink: 0;
          z-index: 1001;
        }

        .header-logo a {
          display: block;
          line-height: 0;
          transition: opacity 0.3s ease;
        }

        .header-logo a:hover {
          opacity: 0.8;
        }

        .header-logo img {
          height: 50px;
          width: auto;
        }

        /* ========== Desktop Navigation ========== */
        .desktop-nav {
          display: none;
        }

        @media (min-width: 992px) {
          .desktop-nav {
            display: block;
          }
        }

        .nav-list {
          display: flex;
          align-items: center;
          gap: 40px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item a {
          color: #2d3748;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
          padding: 8px 0;
        }

        .nav-item a:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #667eea;
          transition: width 0.3s ease;
        }

        .nav-item a:hover {
          color: #667eea;
        }

        .nav-item a:hover:after {
          width: 100%;
        }

        /* ========== Header Actions ========== */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* ========== Hamburger Menu ========== */
        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
          transition: all 0.3s ease;
        }

        @media (min-width: 992px) {
          .hamburger {
            display: none;
          }
        }

        .hamburger:hover {
          opacity: 0.8;
        }

        .hamburger-line {
          width: 25px;
          height: 2px;
          background: #2d3748;
          transition: all 0.3s ease;
          position: relative;
        }

        .hamburger-line:not(:last-child) {
          margin-bottom: 5px;
        }

        /* Hamburger Active State (X) */
        .hamburger.active .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translateY(7px);
        }

        .hamburger.active .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translateY(-7px);
        }

        /* ========== Mobile Menu Overlay ========== */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* ========== Mobile Menu ========== */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 280px;
          max-width: 85%;
          height: 100vh;
          background: #ffffff;
          box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          z-index: 1000;
        }

        .mobile-menu-overlay.active .mobile-menu {
          transform: translateX(0);
        }

        /* ========== Mobile Menu Header ========== */
        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .mobile-logo {
          height: 40px;
          width: auto;
        }

        .close-menu {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #2d3748;
          font-size: 24px;
          transition: all 0.3s ease;
          border-radius: 50%;
        }

        .close-menu:hover {
          background: #f7fafc;
          color: #667eea;
        }

        /* ========== Mobile Navigation ========== */
        .mobile-nav {
          padding: 20px 0;
        }

        .mobile-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-nav-item {
          margin-bottom: 5px;
        }

        .mobile-nav-item a {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          color: #2d3748;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .mobile-nav-item a i {
          color: #667eea;
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .mobile-nav-item a:hover {
          background: #f7fafc;
          color: #667eea;
        }

        /* ========== Mobile Language ========== */
        .mobile-language {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
        }

        /* ========== Spacing for Fixed Header ========== */
        :global(body) {
          padding-top: 80px;
        }

        /* ========== Accessibility ========== */
        .hamburger:focus,
        .close-menu:focus,
        .nav-item a:focus,
        .mobile-nav-item a:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* ========== Responsive Adjustments ========== */
        @media (max-width: 575px) {
          .header-content {
            height: 70px;
            padding: 0 15px;
          }

          .header-logo img {
            height: 40px;
          }

          .mobile-menu {
            width: 100%;
            max-width: 100%;
          }
        }

        /* ========== Print Styles ========== */
        @media print {
          .civiglio-header {
            position: relative;
            box-shadow: none;
          }

          .hamburger,
          .mobile-menu-overlay {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderNew;
