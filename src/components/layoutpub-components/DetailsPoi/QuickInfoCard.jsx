import React from 'react';
import IntlMessage from '../../util-components/IntlMessage';

/**
 * QuickInfoCard Component - Display key POI information at a glance
 *
 * Shows duration, audio guides, photos, and languages available
 */
const QuickInfoCard = ({ poi }) => {
  // Calculate stats
  const audioCount = poi?.audioMediaItems?.items?.length || 0;
  const photoCount = poi?.audioMediaItems?.items?.reduce((acc, item) => {
    return acc + (item.immagine ? 1 : 0);
  }, 1) || 1; // Include main image

  // Get unique languages
  const languages = Array.from(
    new Set(
      poi?.audioMediaItems?.items?.map(item => item.lingua) || []
    )
  );

  // Calculate average duration (example - you can customize)
  const avgDuration = audioCount > 0 ? '45 min' : '-';

  const infoItems = [
    {
      icon: '⏱️',
      label: 'poidetail.duration',
      value: avgDuration
    },
    {
      icon: '🎧',
      label: 'poidetail.audioguides',
      value: audioCount > 0 ? `${audioCount}` : '-'
    },
    {
      icon: '📸',
      label: 'poidetail.photos',
      value: photoCount > 0 ? `${photoCount}` : '-'
    },
    {
      icon: '🌐',
      label: 'poidetail.languages',
      value: languages.length > 0 ? languages.join(', ').toUpperCase() : '-'
    }
  ];

  return (
    <div className="quick-info-card">
      <div className="quick-info-grid">
        {infoItems.map((item, index) => (
          <div key={index} className="info-item">
            <div className="info-icon">{item.icon}</div>
            <div className="info-content">
              <span className="info-label">
                <IntlMessage id={item.label} defaultMessage={item.label.split('.').pop()} />
              </span>
              <span className="info-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .quick-info-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          padding: 24px;
          margin-bottom: 32px;
        }

        .quick-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 20px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .info-icon {
          font-size: 24px;
          line-height: 1;
          flex-shrink: 0;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .info-label {
          font-size: 13px;
          color: #6c757d;
          font-weight: 500;
          text-transform: capitalize;
        }

        .info-value {
          font-size: 16px;
          color: #2c3e50;
          font-weight: 600;
          word-break: break-word;
        }

        @media (max-width: 768px) {
          .quick-info-card {
            padding: 20px;
          }

          .quick-info-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .info-icon {
            font-size: 20px;
          }

          .info-label {
            font-size: 12px;
          }

          .info-value {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickInfoCard;
