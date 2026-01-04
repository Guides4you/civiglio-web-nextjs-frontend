import React from 'react';
import { useRouter } from 'next/router';
import { Image } from 'antd';
import { CLOUDFRONT_URL } from '../../../constants/ApiConstant';
import IntlMessage from '../../util-components/IntlMessage';

const MediaItemCard = ({ media }) => {
  const router = useRouter();
  const isMobile = JSON.parse(router.query.mobile || 'false');

  const ascoltiAudio = media.ascoltoAudio == null ? 0 : media.ascoltoAudio;
  const ascoltoAbstract = media.ascoltoAbstract == null ? 0 : media.ascoltoAbstract;
  const totalPlays = ascoltiAudio + ascoltoAbstract;
  const likes = media.likemedia == null ? 0 : media.likemedia;

  const handleCardClick = () => {
    const encodedTitle = encodeURI(media.audioTitle.replace(/\s/gm, '-'));
    router.push({
      pathname: `/guide/pub/detail/${media.PK}/${encodedTitle}`,
      query: { mobile: isMobile }
    });
  };

  return (
    <>
      <div className="media-item-card" onClick={handleCardClick}>
        {/* Image */}
        <div className="card-image-wrapper">
          <Image
            className="card-image"
            preview={false}
            src={
              media.immagine
                ? `${CLOUDFRONT_URL}/images/${media.immagine}`
                : `${CLOUDFRONT_URL}/images/image_upload.png`
            }
            alt={media.audioTitle}
          />
          {/* Price Badge */}
          <div className="price-badge">
            {media.price > 0 ? (
              <span className="price-premium">€{media.price.toFixed(2)}</span>
            ) : (
              <span className="price-free">FREE</span>
            )}
          </div>
          {/* Play Overlay */}
          <div className="play-overlay">
            <div className="play-button">
              <i className="fa fa-play"></i>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card-content">
          <div className="card-header">
            <h3 className="card-title">{media.audioTitle}</h3>
          </div>

          {/* Description */}
          {media.description && (
            <p className="card-description">
              {media.description.length > 150
                ? `${media.description.substr(0, 150)}...`
                : media.description}
            </p>
          )}

          {/* Stats */}
          <div className="card-stats">
            <div className="stat-item">
              <i className="fa fa-play-circle"></i>
              <span className="stat-value">{totalPlays}</span>
            </div>
            <div className="stat-item">
              <i className="fa fa-heart"></i>
              <span className="stat-value">{likes}</span>
            </div>
            <div className="stat-item">
              <i className="fa fa-language"></i>
              <span className="stat-value">{media.lingua?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .media-item-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          gap: 20px;
        }

        .media-item-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }

        .card-image-wrapper {
          position: relative;
          width: 240px;
          height: 160px;
          flex-shrink: 0;
          overflow: hidden;
        }

        :global(.card-image) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .media-item-card:hover :global(.card-image) {
          transform: scale(1.1);
        }

        .price-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
        }

        .price-premium,
        .price-free {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .price-premium {
          background: linear-gradient(135deg, #faad14 0%, #ff9c00 100%);
          color: #ffffff;
        }

        .price-free {
          background: #52c41a;
          color: #ffffff;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.6) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .media-item-card:hover .play-overlay {
          opacity: 1;
        }

        .play-button {
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

        .media-item-card:hover .play-button {
          transform: scale(1);
        }

        .play-button i {
          font-size: 20px;
          color: #667eea;
          margin-left: 3px;
        }

        .card-content {
          flex: 1;
          padding: 20px 20px 20px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-description {
          font-size: 15px;
          color: #6c757d;
          line-height: 1.6;
          margin: 0;
          flex: 1;
        }

        .card-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #6c757d;
        }

        .stat-item i {
          font-size: 16px;
          color: #667eea;
        }

        .stat-value {
          font-weight: 600;
          color: #2c3e50;
        }

        @media (max-width: 992px) {
          .media-item-card {
            flex-direction: column;
            gap: 0;
          }

          .card-image-wrapper {
            width: 100%;
            height: 200px;
          }

          .card-content {
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .card-image-wrapper {
            height: 180px;
          }

          .card-content {
            padding: 16px;
            gap: 10px;
          }

          .card-title {
            font-size: 18px;
          }

          .card-description {
            font-size: 14px;
          }

          .card-stats {
            gap: 16px;
          }

          .stat-item {
            font-size: 14px;
          }
        }

        @media (max-width: 576px) {
          .card-stats {
            gap: 12px;
          }

          .stat-item {
            font-size: 13px;
          }

          .stat-item i {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default MediaItemCard;
