import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import HeaderNew from '../layoutpub-components/HeaderNew';
import Footer from '../layoutpub-components/Footer';
import IntlMessage from '../util-components/IntlMessage';

const AppLayoutSimple = ({ children }) => {
  const router = useRouter();
  const { mobile } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMode, setIsMobileMode] = useState(false);

  // Persistent mobile mode: save to sessionStorage when detected
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!router.isReady) return; // Wait for router to be ready on SSG pages

    // Check if mobile=true in URL query
    if (mobile === 'true') {
      sessionStorage.setItem('civiglio_mobile_mode', 'true');
      setIsMobileMode(true);
    } else {
      // Check if mobile mode was previously set in session
      const storedMobileMode = sessionStorage.getItem('civiglio_mobile_mode');
      if (storedMobileMode === 'true') {
        setIsMobileMode(true);
      }
    }
  }, [router.isReady, mobile]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { Auth } = await import('aws-amplify');
        const user = await Auth.currentAuthenticatedUser();

        if (user) {
          console.log('AppLayoutSimple: User is authenticated:', user.username);
          setIsAuthenticated(true);
        } else {
          console.log('AppLayoutSimple: No authenticated user, redirecting to login');
          router.replace('/auth/login?redirect=' + encodeURIComponent(router.asPath));
        }
      } catch (error) {
        console.log('AppLayoutSimple: Authentication check failed, redirecting to login:', error);
        router.replace('/auth/login?redirect=' + encodeURIComponent(router.asPath));
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    try {
      const { Auth } = await import('aws-amplify');
      await Auth.signOut();
      sessionStorage.removeItem('civiglio_mobile_mode'); // Clean mobile mode on logout
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Menu items
  const menuItems = [
    {
      path: '/app/home',
      icon: 'fa-home',
      label: 'app.menu.dashboard',
    },
    {
      path: '/app/content',
      icon: 'fa-folder-open',
      label: 'app.menu.mycontent',
    },
    {
      path: '/app/profile',
      icon: 'fa-user',
      label: 'app.menu.profile',
    },
  ];

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div id="wrapper" className="listeo">
        <div className="auth-loading-container">
          <div className="auth-loading">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Verifica autenticazione...</p>
            </div>
          </div>

          <style jsx>{`
            .auth-loading-container {
              min-height: 100vh;
              background: #f5f7fa;
            }

            .auth-loading {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }

            .loading-spinner {
              text-align: center;
            }

            .spinner {
              width: 50px;
              height: 50px;
              margin: 0 auto 20px;
              border: 4px solid rgba(102, 126, 234, 0.2);
              border-top: 4px solid #667eea;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }

            .loading-spinner p {
              color: #667eea;
              font-size: 16px;
              font-weight: 500;
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is in progress)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div id="wrapper" className="listeo">
      {isMobileMode === false && <HeaderNew />}

      <div>
        <div style={{ overflow: 'hidden' }}>
          <div className="app-layout">
            {/* Desktop Sidebar */}
            <aside className={`app-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
              {/* Sidebar Header */}
              <div className="sidebar-header">
                {sidebarOpen && (
                  <h2 className="sidebar-title">
                    <IntlMessage id="app.menu.title" />
                  </h2>
                )}
                <button
                  className="sidebar-toggle"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <i className={`fa fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                  {menuItems.map((item) => (
                    <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
                      <Link href={item.path} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '16px 24px'
                      }}>
                        <i className={`fa ${item.icon}`} style={{
                          fontSize: '22px',
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
                        {sidebarOpen && (
                          <span className="menu-label">
                            <IntlMessage id={item.label} />
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className={`app-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
              <div className="content-container">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>

      {isMobileMode === false && <Footer />}

      {/* Mobile Mode: Floating Menu Button */}
      {isMobileMode && (
        <>
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Apri menu"
          >
            <i className="fa fa-bars"></i>
          </button>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
              <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="mobile-menu-header">
                  <h2>Menu</h2>
                  <button
                    className="mobile-menu-close"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Chiudi menu"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="mobile-menu-nav">
                  <ul className="mobile-menu-list">
                    {menuItems.map((item) => (
                      <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
                        <Link
                          href={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px 20px',
                            textDecoration: 'none',
                            color: 'inherit'
                          }}
                        >
                          <i className={`fa ${item.icon}`} style={{
                            fontSize: '20px',
                            width: '40px',
                            height: '40px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#667eea',
                            background: 'rgba(102, 126, 234, 0.1)',
                            borderRadius: '10px'
                          }}></i>
                          <span style={{ fontSize: '16px', fontWeight: 500 }}>
                            <IntlMessage id={item.label} />
                          </span>
                        </Link>
                      </li>
                    ))}

                    {/* Divider */}
                    <li className="menu-divider"></li>

                    {/* Home Pubblica */}
                    <li>
                      <Link
                        href="/guide/pub/home"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px 20px',
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <i className="fa fa-globe" style={{
                          fontSize: '20px',
                          width: '40px',
                          height: '40px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#48bb78',
                          background: 'rgba(72, 187, 120, 0.1)',
                          borderRadius: '10px'
                        }}></i>
                        <span style={{ fontSize: '16px', fontWeight: 500 }}>
                          Home Pubblica
                        </span>
                      </Link>
                    </li>

                    {/* Logout */}
                    <li>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px 20px',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: 'inherit',
                          fontSize: 'inherit'
                        }}
                      >
                        <i className="fa fa-sign-out" style={{
                          fontSize: '20px',
                          width: '40px',
                          height: '40px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f56565',
                          background: 'rgba(245, 101, 101, 0.1)',
                          borderRadius: '10px'
                        }}></i>
                        <span style={{ fontSize: '16px', fontWeight: 500 }}>
                          Logout
                        </span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        /* ========== App Layout Container ========== */
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: #f5f7fa;
          position: relative;
        }

        /* ========== Desktop Sidebar ========== */
        .app-sidebar {
          position: fixed;
          left: 0;
          top: 80px;
          bottom: auto;
          height: calc(100vh - 80px);
          width: 260px;
          background: #ffffff;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          z-index: 50;
          overflow-y: auto;
          display: none;
        }

        @media (min-width: 992px) {
          .app-sidebar {
            display: block;
          }
        }

        .app-sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        .sidebar-toggle {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: #667eea;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .sidebar-toggle:hover {
          background: #f7fafc;
        }

        .app-sidebar.collapsed .sidebar-header {
          padding: 24px 10px;
          justify-content: center;
        }

        /* ========== Sidebar Navigation ========== */
        .sidebar-nav {
          padding: 12px 0;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-menu li {
          margin-bottom: 4px;
        }

        .sidebar-menu li a {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 24px;
          color: #4a5568;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .app-sidebar.collapsed .sidebar-menu li a {
          justify-content: center;
          padding: 16px 10px;
          gap: 0;
        }

        .sidebar-menu li a i {
          font-size: 22px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #667eea;
          flex-shrink: 0;
          background: rgba(102, 126, 234, 0.08);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .menu-label {
          flex: 1;
        }

        .sidebar-menu li a:hover {
          background: #f7fafc;
          color: #667eea;
        }

        .sidebar-menu li a:hover i {
          background: rgba(102, 126, 234, 0.15);
          transform: scale(1.05);
        }

        .sidebar-menu li.active a {
          background: #eef2ff;
          color: #667eea;
          border-left-color: #667eea;
          font-weight: 600;
        }

        .sidebar-menu li.active a i {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .app-sidebar.collapsed .sidebar-menu li.active a {
          border-left-color: transparent;
          background: #667eea;
          color: #ffffff;
        }

        .app-sidebar.collapsed .sidebar-menu li.active a i {
          background: #ffffff;
          color: #667eea;
        }

        /* ========== Main Content Area ========== */
        .app-content {
          flex: 1;
          padding: 104px 0 40px 0;
          margin-left: 0;
          transition: margin-left 0.3s ease;
          min-height: calc(100vh - 80px);
        }

        /* Mobile mode: remove top padding (no header) */
        #wrapper.listeo:has(.mobile-menu-button) .app-content {
          padding: 20px 0 80px 0;
          min-height: 100vh;
        }

        @media (min-width: 992px) {
          .app-content.sidebar-open {
            margin-left: 260px;
          }

          .app-content.sidebar-collapsed {
            margin-left: 70px;
          }
        }

        .content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ========== Responsive Adjustments ========== */
        @media (max-width: 768px) {
          .app-content {
            padding: 96px 0 24px 0;
          }

          .content-container {
            padding: 0 16px;
          }
        }

        /* ========== Scrollbar Styling ========== */
        .app-sidebar::-webkit-scrollbar,
        .mobile-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .app-sidebar::-webkit-scrollbar-track,
        .mobile-sidebar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .app-sidebar::-webkit-scrollbar-thumb,
        .mobile-sidebar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .app-sidebar::-webkit-scrollbar-thumb:hover,
        .mobile-sidebar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* ========== Mobile Mode: Floating Menu Button ========== */
        .mobile-menu-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
          cursor: pointer;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transition: all 0.3s ease;
        }

        .mobile-menu-button:active {
          transform: scale(0.95);
        }

        /* ========== Mobile Menu Drawer ========== */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 280px;
          max-width: 85vw;
          background: white;
          box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
          animation: slideInRight 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .mobile-menu-header {
          padding: 24px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-menu-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .mobile-menu-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          transition: background 0.2s ease;
        }

        .mobile-menu-close:active {
          background: rgba(255, 255, 255, 0.3);
        }

        .mobile-menu-nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .mobile-menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-menu-list li {
          border-bottom: 1px solid #f0f0f0;
        }

        .mobile-menu-list li:last-child {
          border-bottom: none;
        }

        .mobile-menu-list li.active {
          background: #eef2ff;
        }

        .mobile-menu-list li.active i {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
        }

        /* Menu Divider */
        .mobile-menu-list li.menu-divider {
          height: 8px;
          background: #f7fafc;
          border-bottom: none;
          margin: 8px 0;
        }

        /* ========== Animations ========== */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AppLayoutSimple;
