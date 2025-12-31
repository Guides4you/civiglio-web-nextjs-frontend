import React from 'react';
import { Image } from 'antd';
import IntlMessage from '../../util-components/IntlMessage';
import { APP_PUBLIC_PATH } from '../../../configs/AppConfig';
import { CLOUDFRONT_URL } from '../../../constants/ApiConstant';
import { replace } from 'lodash-es';
import { useRouter } from 'next/router';

const Popular = ({ pois }) => {
  const router = useRouter();

  if (!pois || pois.length === 0) return null;

  const goToPoi = (e, poi) => {
    e.preventDefault();
    const isMobile = router.query.mobile || false;
    const titolo = encodeURI(replace(poi.audioMediaItems.items[0].audioTitle, /\s/g, '-'));
    router.push({
      pathname: `${APP_PUBLIC_PATH}/detail/${poi.audioMediaItems.items[0].PK}/${titolo}`,
      query: { mobile: isMobile }
    });
  };

  return (
    <div className="popular-section">
      <div className="popular-header">
        <i className="fa fa-fire section-icon"></i>
        <h3 className="section-title">
          <IntlMessage id="poidetail.popular" />
        </h3>
      </div>

      <div className="popular-grid">
        {pois.map((p, i) => (
          <div
            className="popular-card"
            key={i}
            onClick={(e) => goToPoi(e, p)}
          >
            <div className="card-image-wrapper">
              <Image
                preview={false}
                src={`${CLOUDFRONT_URL}/images/${p.immagine}`}
                alt={p.titolo}
                className="card-image"
              />
              <div className="image-overlay">
                <div className="play-icon">
                  <i className="fa fa-play"></i>
                </div>
              </div>

              {/* Rank Badge */}
              <div className="rank-badge">
                <span>#{i + 1}</span>
              </div>
            </div>

            <div className="card-content">
              <h4 className="card-title">
                {p.audioMediaItems.items[0]?.audioTitle || p.titolo}
              </h4>

              <div className="card-meta">
                <div className="meta-item">
                  <i className="fa fa-thumbs-up"></i>
                  <span>{p.likes || 0}</span>
                </div>
                <div className="meta-item">
                  <i className="fa fa-headphones"></i>
                  <span>{p.audioMediaItems?.items?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .popular-section {
          position: sticky;
          top: 24px;
        }

        .popular-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #667eea;
        }

        .section-icon {
          font-size: 24px;
          color: #ff6b6b;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .popular-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .popular-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .popular-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        :global(.popular-card .card-image) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .popular-card:hover :global(.card-image) {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .popular-card:hover .image-overlay {
          opacity: 1;
        }

        .play-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transform: scale(0.8);
          transition: transform 0.3s ease;
        }

        .popular-card:hover .play-icon {
          transform: scale(1);
        }

        .play-icon i {
          font-size: 20px;
          color: #667eea;
          margin-left: 3px;
        }

        .rank-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .rank-badge span {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }

        .card-content {
          padding: 16px;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 12px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6c757d;
        }

        .meta-item i {
          font-size: 14px;
          color: #667eea;
        }

        .meta-item span {
          font-weight: 500;
        }

        /* Mobile Responsive */
        @media (max-width: 991px) {
          .popular-section {
            position: static;
            margin-top: 40px;
          }

          .popular-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .card-image-wrapper {
            height: 140px;
          }

          .section-title {
            font-size: 20px;
          }
        }

        @media (max-width: 576px) {
          .popular-grid {
            grid-template-columns: 1fr;
          }

          .card-image-wrapper {
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default Popular;
