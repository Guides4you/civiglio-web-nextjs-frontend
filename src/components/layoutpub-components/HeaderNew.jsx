import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavLanguage from './NavLanguage';
import { LOGO } from '../../configs/AppConfig';
import IntlMessage from '../util-components/IntlMessage';
import { CiviglioContext } from '../layouts/PubLayout';

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
 * - User profile dropdown when logged in
 */
const HeaderNew = () => {
  const router = useRouter();
  const context = useContext(CiviglioContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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

  // Check user auth status
  useEffect(() => {
    const checkUser = async () => {
      if (typeof window === 'undefined') return;

      try {
        const { Auth } = await import('aws-amplify');
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      }
    };

    checkUser();
  }, [context?.authChanged]); // Re-check when auth changes

  // Listen to auth events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hubListener;
    const setupAuthListener = async () => {
      const { Hub } = await import('aws-amplify');
      const { Auth } = await import('aws-amplify');

      hubListener = Hub.listen('auth', async (data) => {
        const { payload } = data;

        if (payload.event === 'signIn') {
          try {
            const currentUser = await Auth.currentAuthenticatedUser();
            setUser(currentUser);
          } catch (err) {
            setUser(null);
          }
        } else if (payload.event === 'signOut') {
          setUser(null);
        }
      });
    };

    setupAuthListener();

    return () => {
      if (hubListener) {
        import('aws-amplify').then(({ Hub }) => {
          Hub.remove('auth', hubListener);
        });
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-profile-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const { Auth } = await import('aws-amplify');
      await Auth.signOut();
      setUser(null);
      setUserDropdownOpen(false);
      router.push('/guide/pub/home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';

    const attributes = user.attributes || {};
    if (attributes.name) return attributes.name;
    if (attributes.email) return attributes.email.split('@')[0];
    if (user.username) return user.username;
    return 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
                {user ? (
                  <li className="nav-item user-profile-dropdown">
                    <button
                      className="user-profile-button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      aria-label="User menu"
                      aria-expanded={userDropdownOpen}
                    >
                      <div className="user-avatar">
                        {getUserInitials()}
                      </div>
                      <span className="user-name">{getUserDisplayName()}</span>
                      <i className={`fa fa-chevron-down dropdown-icon ${userDropdownOpen ? 'open' : ''}`}></i>
                    </button>

                    {userDropdownOpen && (
                      <div className="user-dropdown-menu">
                        <div className="dropdown-header">
                          <div className="user-info">
                            <div className="user-avatar-large">
                              {getUserInitials()}
                            </div>
                            <div className="user-details">
                              <div className="user-name-full">{getUserDisplayName()}</div>
                              <div className="user-email">{user.attributes?.email}</div>
                            </div>
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <ul className="dropdown-list">
                          <li>
                            <Link href="/app/home" onClick={() => setUserDropdownOpen(false)} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '12px 16px'
                            }}>
                              <i className="fa fa-home" style={{
                                fontSize: '20px',
                                width: '32px',
                                height: '32px',
                                minWidth: '32px',
                                minHeight: '32px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: '#667eea',
                                background: 'rgba(102, 126, 234, 0.08)',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                flexShrink: 0
                              }}></i>
                              <IntlMessage id="header.dashboard" />
                            </Link>
                          </li>
                          <li>
                            <Link href="/app/profile" onClick={() => setUserDropdownOpen(false)} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '12px 16px'
                            }}>
                              <i className="fa fa-user" style={{
                                fontSize: '20px',
                                width: '32px',
                                height: '32px',
                                minWidth: '32px',
                                minHeight: '32px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: '#667eea',
                                background: 'rgba(102, 126, 234, 0.08)',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                flexShrink: 0
                              }}></i>
                              <IntlMessage id="header.profile" />
                            </Link>
                          </li>
                        </ul>
                        <div className="dropdown-divider"></div>
                        <button className="logout-button" onClick={handleLogout} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '12px 16px'
                        }}>
                          <i className="fa fa-sign-out" style={{
                            fontSize: '20px',
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            minHeight: '32px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: '#e53e3e',
                            background: 'rgba(229, 62, 62, 0.08)',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            flexShrink: 0
                          }}></i>
                          <IntlMessage id="logout" />
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link href="/auth/login">
                      <IntlMessage id="login" />
                    </Link>
                  </li>
                )}
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
            {user && (
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {getUserInitials()}
                </div>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">{getUserDisplayName()}</div>
                  <div className="mobile-user-email">{user.attributes?.email}</div>
                </div>
              </div>
            )}

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

              {user ? (
                <>
                  <li className="mobile-nav-item">
                    <Link href="/app/home" onClick={closeMobileMenu} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 16px'
                    }}>
                      <i className="fa fa-dashboard" style={{
                        fontSize: '20px',
                        width: '32px',
                        height: '32px',
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: '#667eea',
                        background: 'rgba(102, 126, 234, 0.08)',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                      }}></i>
                      <IntlMessage id="header.dashboard" />
                    </Link>
                  </li>
                  <li className="mobile-nav-item">
                    <Link href="/app/profile" onClick={closeMobileMenu} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 16px'
                    }}>
                      <i className="fa fa-user" style={{
                        fontSize: '20px',
                        width: '32px',
                        height: '32px',
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: '#667eea',
                        background: 'rgba(102, 126, 234, 0.08)',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                      }}></i>
                      <IntlMessage id="header.profile" />
                    </Link>
                  </li>
                  <li className="mobile-nav-item">
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="mobile-logout-button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '12px 16px'
                      }}
                    >
                      <i className="fa fa-sign-out" style={{
                        fontSize: '20px',
                        width: '32px',
                        height: '32px',
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: '#e53e3e',
                        background: 'rgba(229, 62, 62, 0.08)',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                      }}></i>
                      <IntlMessage id="logout" />
                    </button>
                  </li>
                </>
              ) : (
                <li className="mobile-nav-item">
                  <Link href="/auth/login" onClick={closeMobileMenu} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 16px'
                  }}>
                    <i className="fa fa-sign-in" style={{
                      fontSize: '20px',
                      width: '32px',
                      height: '32px',
                      minWidth: '32px',
                      minHeight: '32px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: '#667eea',
                      background: 'rgba(102, 126, 234, 0.08)',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}></i>
                    <IntlMessage id="login" />
                  </Link>
                </li>
              )}
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

        /* ========== User Profile Dropdown ========== */
        .user-profile-dropdown {
          position: relative;
        }

        .user-profile-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .user-profile-button:hover {
          background: #f7fafc;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .user-name {
          color: #2d3748;
          font-size: 15px;
          font-weight: 500;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-icon {
          color: #667eea;
          font-size: 12px;
          transition: transform 0.3s ease;
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 1002;
          animation: slideDown 0.2s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-large {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name-full {
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-email {
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 0;
        }

        .dropdown-list {
          list-style: none;
          padding: 8px 0;
          margin: 0;
        }

        .dropdown-list li a {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 24px;
          color: #2d3748;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .dropdown-list li a i {
          color: #667eea;
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: rgba(102, 126, 234, 0.08);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .dropdown-list li a:hover {
          background: #f7fafc;
          color: #667eea;
        }

        .dropdown-list li a:hover i {
          background: rgba(102, 126, 234, 0.15);
          transform: scale(1.05);
        }

        .logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 24px;
          background: transparent;
          border: none;
          color: #e53e3e;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .logout-button i {
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: rgba(229, 62, 62, 0.08);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .logout-button:hover {
          background: #fff5f5;
        }

        .logout-button:hover i {
          background: rgba(229, 62, 62, 0.15);
          transform: scale(1.05);
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

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: -20px 0 20px 0;
        }

        .mobile-user-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .mobile-user-details {
          flex: 1;
          min-width: 0;
        }

        .mobile-user-name {
          color: #ffffff;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobile-user-email {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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

        .mobile-logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: transparent;
          border: none;
          color: #e53e3e;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .mobile-logout-button i {
          color: #e53e3e;
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .mobile-logout-button:hover {
          background: #fff5f5;
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
