import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import HeaderNew from '../layoutpub-components/HeaderNew';
import Footer from '../layoutpub-components/Footer';
import IntlMessage from '../util-components/IntlMessage';

const AppLayoutSimple = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileSidebarOpen(false);
    };

    router.events?.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  // Menu items
  const menuItems = [
    {
      path: '/app/home',
      icon: 'fa-home',
      label: 'app.menu.dashboard',
    },
    {
      path: '/app/audio',
      icon: 'fa-music',
      label: 'app.menu.myaudio',
    },
    {
      path: '/app/poi',
      icon: 'fa-map-marker',
      label: 'app.menu.mypoi',
    },
    {
      path: '/app/profile',
      icon: 'fa-user',
      label: 'app.menu.profile',
    },
  ];

  return (
    <div id="wrapper" className="listeo">
      <HeaderNew />

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

            {/* Mobile Sidebar Toggle Button */}
            <button
              className="mobile-sidebar-toggle"
              onClick={toggleMobileSidebar}
              aria-label="Toggle menu"
            >
              <i className="fa fa-bars"></i>
            </button>

            {/* Mobile Sidebar Overlay */}
            <div
              className={`mobile-sidebar-overlay ${mobileSidebarOpen ? 'active' : ''}`}
              onClick={toggleMobileSidebar}
            ></div>

            {/* Mobile Sidebar */}
            <aside className={`mobile-sidebar ${mobileSidebarOpen ? 'active' : ''}`}>
              <div className="mobile-sidebar-header">
                <h2 className="sidebar-title">
                  <IntlMessage id="app.menu.title" />
                </h2>
                <button
                  className="close-button"
                  onClick={toggleMobileSidebar}
                  aria-label="Close menu"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>

              <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                  {menuItems.map((item) => (
                    <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
                      <Link href={item.path} onClick={toggleMobileSidebar} style={{
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
                        <span className="menu-label">
                          <IntlMessage id={item.label} />
                        </span>
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

      <Footer />

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

        /* ========== Mobile Sidebar Toggle ========== */
        .mobile-sidebar-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: #ffffff;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        @media (min-width: 992px) {
          .mobile-sidebar-toggle {
            display: none;
          }
        }

        .mobile-sidebar-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        /* ========== Mobile Sidebar Overlay ========== */
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 800;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* ========== Mobile Sidebar ========== */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          max-width: 85%;
          height: 100vh;
          background: #ffffff;
          box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          z-index: 900;
          display: block;
        }

        @media (min-width: 992px) {
          .mobile-sidebar {
            display: none;
          }
        }

        .mobile-sidebar.active {
          transform: translateX(0);
        }

        .mobile-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .mobile-sidebar-header .sidebar-title {
          color: #ffffff;
        }

        .close-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #ffffff;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* ========== Main Content Area ========== */
        .app-content {
          flex: 1;
          padding: 104px 0 40px 0;
          margin-left: 0;
          transition: margin-left 0.3s ease;
          min-height: calc(100vh - 80px);
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
      `}</style>
    </div>
  );
};

export default AppLayoutSimple;
