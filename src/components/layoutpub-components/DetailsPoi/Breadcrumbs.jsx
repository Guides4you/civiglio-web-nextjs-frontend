import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Breadcrumbs Component - Modern navigation breadcrumbs
 *
 * Shows hierarchical navigation path with clean design
 */
const Breadcrumbs = ({ items = [] }) => {
  const router = useRouter();

  // Default breadcrumbs if none provided
  const defaultItems = [
    { label: 'Home', href: '/' },
    { label: 'Guide', href: '/guide/pub' },
    { label: 'Dettaglio', href: router.asPath }
  ];

  const breadcrumbItems = items.length > 0 ? items : defaultItems;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className="breadcrumbs-item">
              {!isLast ? (
                <>
                  <Link href={item.href} className="breadcrumbs-link">
                    {item.label}
                  </Link>
                  <span className="breadcrumbs-separator" aria-hidden="true">›</span>
                </>
              ) : (
                <span className="breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <style jsx>{`
        .breadcrumbs {
          margin-bottom: 16px;
        }

        .breadcrumbs-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 8px;
        }

        .breadcrumbs-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .breadcrumbs-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumbs-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .breadcrumbs-separator {
          color: rgba(255, 255, 255, 0.6);
          user-select: none;
        }

        .breadcrumbs-current {
          color: #ffffff;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .breadcrumbs-item {
            font-size: 13px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Breadcrumbs;
