import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IntlMessage from '../../util-components/IntlMessage';
import { nazioni } from '../../../lang/bandiere';
import { languageNativeNames } from '../../../lang/languages-civiglio';

const ChannelStats = ({ profileInfo, medias }) => {
  const { locale } = useSelector((state) => state.theme);
  const [nationality, setNationality] = useState(null);
  const [registeredDate, setRegisteredDate] = useState(null);

  useEffect(() => {
    if (profileInfo) {
      // Find nationality
      const country = nazioni.find((n) => n.name === profileInfo.billingCountry);
      setNationality(country);

      // Format registration date
      if (profileInfo.createdAt) {
        const date = new Date(profileInfo.createdAt);
        const formatted = date.toLocaleDateString(
          languageNativeNames[locale]?.localeLabel || 'it-IT',
          languageNativeNames[locale]?.localeDateString || {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        );
        setRegisteredDate(formatted);
      }
    }
  }, [profileInfo, locale]);

  return (
    <>
      <div className="channel-stats">
        <div className="stat-item">
          <i className="fa fa-music"></i>
          <div className="stat-content">
            <span className="stat-label">
              <IntlMessage id="channel.publish.content" />
            </span>
            <span className="stat-value">{medias?.length || 0}</span>
          </div>
        </div>

        <div className="stat-item">
          <i className="fa fa-users"></i>
          <div className="stat-content">
            <span className="stat-label">
              <IntlMessage id="channel.followers" />
            </span>
            <span className="stat-value">{profileInfo?.followers || 0}</span>
          </div>
        </div>

        {nationality && (
          <div className="stat-item">
            <i className="fa fa-flag"></i>
            <div className="stat-content">
              <span className="stat-label">
                <IntlMessage id="channel.nationality" />
              </span>
              <span className="stat-value">
                {nationality.name}
                <img
                  src={`data:image/png;base64,${nationality.flag}`}
                  alt={nationality.name}
                  className="flag-icon"
                />
              </span>
            </div>
          </div>
        )}

        {registeredDate && (
          <div className="stat-item">
            <i className="fa fa-calendar"></i>
            <div className="stat-content">
              <span className="stat-label">
                <IntlMessage id="channel.registered" />
              </span>
              <span className="stat-value">{registeredDate}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .channel-stats {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-item i {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.9);
          width: 32px;
          text-align: center;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 18px;
          color: #ffffff;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .flag-icon {
          width: 24px;
          height: auto;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .channel-stats {
            gap: 24px;
          }

          .stat-item i {
            font-size: 20px;
            width: 28px;
          }

          .stat-label {
            font-size: 12px;
          }

          .stat-value {
            font-size: 16px;
          }

          .flag-icon {
            width: 20px;
          }
        }

        @media (max-width: 576px) {
          .channel-stats {
            gap: 16px;
          }

          .stat-item {
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default ChannelStats;
