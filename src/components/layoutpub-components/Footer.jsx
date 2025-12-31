import React from 'react';
import Link from 'next/link';
import IntlMessage from '../util-components/IntlMessage';

/**
 * Footer Component - Top-tier design
 *
 * Features:
 * - Dark gray background (#2d3748 top, #1a202c bottom)
 * - 2-column layout (matching React original)
 * - Social links in bottom footer
 * - Responsive design
 * - Smooth hover effects
 * - Icon animations
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="civiglio-footer">
        {/* Top Footer Section */}
        <div className="footer-top">
          <div className="container">
            <div className="row">
              {/* Column 1: Logo + Description + Contact Info */}
              <div className="col-lg-6 col-md-12">
                <div className="footer-brand">
                  <Link href="/" className="footer-logo">
                    <img
                      src="/img/civiglio/logo-civiglio-200-white.png"
                      alt="Civiglio"
                      className="logo-image"
                    />
                  </Link>
                  <p className="footer-description">
                    <IntlMessage id="footer.message" />
                  </p>
                </div>

                <div className="footer-contacts">
                  <ul className="contact-list">
                    <li className="contact-item">
                      <div className="contact-icon">
                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                      </div>
                      <div className="contact-text">
                        <p>Via Guglielmo Marconi 470</p>
                        <p>Quattromiglia, Rende (CS) 87036</p>
                      </div>
                    </li>
                    <li className="contact-item">
                      <div className="contact-icon">
                        <i className="fa fa-phone" aria-hidden="true"></i>
                      </div>
                      <div className="contact-text">
                        <p>+39 0984 404 470</p>
                      </div>
                    </li>
                    <li className="contact-item">
                      <div className="contact-icon">
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                      </div>
                      <div className="contact-text">
                        <a href="mailto:info@guides4you.it">info@guides4you.it</a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 2: Navigation */}
              <div className="col-lg-6 col-md-12">
                <div className="footer-navigation">
                  <h3 className="footer-heading">
                    <IntlMessage id="sidenav.components.navigation" />
                  </h3>
                  <div className="footer-nav-columns">
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
                        <Link href="/guide/pub/home">
                          Scopri i POI
                        </Link>
                      </li>
                      <li className="nav-item">
                        <a
                          href="https://www.guides4you.it"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chi Siamo
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-content">
              <p className="copyright">
                © {currentYear} Guides4You. Tutti i diritti riservati.
              </p>
              <ul className="social-links">
                <li>
                  <a
                    href="https://www.facebook.com/Guides4youSrls"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/Guides4youSrls"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/guides4you/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <i className="fa fa-linkedin" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* ========== Footer Main Container ========== */
        .civiglio-footer {
          width: 100%;
          margin-top: auto;
        }

        /* ========== Top Footer (Dark Gray) ========== */
        .footer-top {
          background: linear-gradient(180deg, #2d3748 0%, #1e2936 100%);
          padding: 60px 0 40px;
          color: #e2e8f0;
        }

        /* ========== Brand Section ========== */
        .footer-brand {
          margin-bottom: 30px;
        }

        .footer-logo {
          display: inline-block;
          margin-bottom: 20px;
          transition: opacity 0.3s ease;
        }

        .footer-logo:hover {
          opacity: 0.8;
        }

        .logo-image {
          height: 50px;
          width: auto;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .footer-description {
          font-size: 15px;
          line-height: 1.7;
          color: #cbd5e0;
          max-width: 450px;
          margin: 0;
        }

        /* ========== Contact Info ========== */
        .footer-contacts {
          margin-top: 30px;
        }

        .contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }

        .contact-item:hover {
          transform: translateX(5px);
        }

        .contact-icon {
          width: 40px;
          height: 40px;
          background: rgba(102, 126, 234, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .contact-item:hover .contact-icon {
          background: #667eea;
          transform: scale(1.1);
        }

        .contact-icon i {
          color: #667eea;
          font-size: 18px;
          transition: color 0.3s ease;
        }

        .contact-item:hover .contact-icon i {
          color: white;
        }

        .contact-text {
          flex: 1;
        }

        .contact-text p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #cbd5e0;
        }

        .contact-text a {
          color: #667eea;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-text a:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        /* ========== Navigation Section ========== */
        .footer-navigation {
          padding-left: 40px;
        }

        @media (max-width: 991px) {
          .footer-navigation {
            padding-left: 0;
            margin-top: 40px;
          }
        }

        .footer-heading {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(102, 126, 234, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer-nav-columns {
          display: flex;
          gap: 40px;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .nav-item {
          margin-bottom: 12px;
        }

        .nav-item a {
          color: #cbd5e0;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
          padding-left: 20px;
        }

        .nav-item a:before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #667eea;
          opacity: 0;
          transition: all 0.3s ease;
          transform: translateX(-5px);
        }

        .nav-item a:hover {
          color: white;
          transform: translateX(5px);
        }

        .nav-item a:hover:before {
          opacity: 1;
          transform: translateX(0);
        }

        /* ========== Bottom Footer (Darker) ========== */
        .footer-bottom {
          background: #1a202c;
          padding: 25px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        @media (max-width: 767px) {
          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }
        }

        .copyright {
          margin: 0;
          font-size: 14px;
          color: #a0aec0;
        }

        /* ========== Social Links ========== */
        .social-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 15px;
        }

        .social-links li a {
          width: 42px;
          height: 42px;
          background: rgba(102, 126, 234, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          font-size: 18px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }

        .social-links li a:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .social-links li a:active {
          transform: translateY(-1px) scale(1);
        }

        /* ========== Responsive Adjustments ========== */
        @media (max-width: 991px) {
          .footer-top {
            padding: 50px 0 30px;
          }

          .footer-description {
            max-width: 100%;
          }
        }

        @media (max-width: 767px) {
          .footer-top {
            padding: 40px 0 30px;
          }

          .footer-heading {
            font-size: 16px;
            margin-bottom: 20px;
          }

          .footer-nav-columns {
            flex-direction: column;
            gap: 20px;
          }

          .social-links {
            justify-content: center;
          }
        }

        @media (max-width: 575px) {
          .logo-image {
            height: 40px;
          }

          .contact-icon {
            width: 35px;
            height: 35px;
          }

          .contact-icon i {
            font-size: 16px;
          }

          .contact-text p {
            font-size: 13px;
          }
        }

        /* ========== Accessibility ========== */
        .footer-logo:focus,
        .nav-item a:focus,
        .contact-text a:focus,
        .social-links li a:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* ========== Print Styles ========== */
        @media print {
          .footer-bottom {
            border-top: 1px solid #000;
          }

          .social-links {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
