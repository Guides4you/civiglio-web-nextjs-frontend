import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { CLOUDFRONT_URL } from '../../../constants/ApiConstant';
import { APP_PUBLIC_PATH } from '../../../configs/AppConfig';
import './POICarousel.module.css';

/**
 * POICarousel - Top-tier carousel component for POI items
 * Features:
 * - Auto-play with pause on hover
 * - Touch/swipe support
 * - Keyboard navigation
 * - Responsive
 * - Smooth animations
 * - Navigation arrows
 * - Pagination dots
 */
const POICarousel = ({ pois = [], autoplayDelay = 4000, title, subtitle }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || !isAutoPlaying) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, autoplayDelay);

    return () => clearInterval(autoplay);
  }, [emblaApi, isAutoPlaying, autoplayDelay]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!pois || pois.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <p>Nessun POI disponibile al momento.</p>
      </div>
    );
  }

  return (
    <div className="poi-carousel-wrapper" style={{ padding: '40px 0', background: '#f8f9fa' }}>
      <div className="container">
        {title && <h2 className="carousel-title">{title}</h2>}
        {subtitle && <p className="carousel-subtitle">{subtitle}</p>}

        <div
          className="poi-carousel"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="poi-carousel__viewport" ref={emblaRef}>
            <div className="poi-carousel__container">
              {pois.map((poi, index) => {
                const firstAudio = poi.audioMediaItems?.items?.[0];
                if (!firstAudio) return null;

                const poiId = firstAudio.PK || poi.rangeKey;
                const titolo = encodeURI(
                  (firstAudio.audioTitle || poi.title || 'dettaglio').replace(/\s/g, '-')
                );
                const detailUrl = `${APP_PUBLIC_PATH}/pub/detail/${poiId}/${titolo}`;

                return (
                  <div className="poi-carousel__slide" key={index}>
                    <Link href={detailUrl} className="poi-card">
                      <div className="poi-card__image-wrapper">
                        {poi.immagine ? (
                          <img
                            src={`${CLOUDFRONT_URL}/images/${poi.immagine}`}
                            alt={firstAudio.audioTitle || poi.title}
                            className="poi-card__image"
                          />
                        ) : (
                          <div className="poi-card__image-placeholder">
                            <i className="fa fa-map-marker" style={{ fontSize: 48, color: '#ccc' }}></i>
                          </div>
                        )}
                        <div className="poi-card__overlay">
                          <i className="fa fa-eye" style={{ fontSize: 24 }}></i>
                          <span>Scopri</span>
                        </div>
                      </div>
                      <div className="poi-card__content">
                        <h5 className="poi-card__title">
                          {firstAudio.audioTitle || poi.title || 'POI'}
                        </h5>
                        <div className="poi-card__meta">
                          <span className="poi-card__meta-item">
                            <i className="fa fa-music"></i>
                            {poi.audioMediaItems?.items?.length || 0} audio
                          </span>
                          {poi.likes > 0 && (
                            <span className="poi-card__meta-item poi-card__meta-item--likes">
                              <i className="fa fa-heart"></i>
                              {poi.likes}
                            </span>
                          )}
                        </div>
                        {firstAudio.abstract && (
                          <p className="poi-card__description">
                            {firstAudio.abstract.substring(0, 100)}
                            {firstAudio.abstract.length > 100 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            className={`poi-carousel__button poi-carousel__button--prev ${
              !canScrollPrev ? 'poi-carousel__button--disabled' : ''
            }`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous slide"
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            className={`poi-carousel__button poi-carousel__button--next ${
              !canScrollNext ? 'poi-carousel__button--disabled' : ''
            }`}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next slide"
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="poi-carousel__dots">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`poi-carousel__dot ${
                index === selectedIndex ? 'poi-carousel__dot--active' : ''
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #1a3353;
          text-align: center;
        }

        .carousel-subtitle {
          font-size: 16px;
          color: #6c757d;
          margin-bottom: 30px;
          text-align: center;
        }

        .poi-carousel {
          position: relative;
        }

        .poi-carousel__viewport {
          overflow: hidden;
          border-radius: 12px;
        }

        .poi-carousel__container {
          display: flex;
          gap: 20px;
          margin-left: -10px;
        }

        .poi-carousel__slide {
          flex: 0 0 calc(33.333% - 14px);
          min-width: 0;
          padding-left: 10px;
          padding-right: 10px;
        }

        @media (max-width: 1024px) {
          .poi-carousel__slide {
            flex: 0 0 calc(50% - 10px);
          }
        }

        @media (max-width: 640px) {
          .poi-carousel__slide {
            flex: 0 0 calc(100% - 20px);
          }
        }

        .poi-card {
          display: block;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .poi-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .poi-card__image-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #e9ecef;
        }

        .poi-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .poi-card:hover .poi-card__image {
          transform: scale(1.1);
        }

        .poi-card__image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .poi-card__overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          font-weight: 600;
        }

        .poi-card:hover .poi-card__overlay {
          opacity: 1;
        }

        .poi-card__content {
          padding: 20px;
        }

        .poi-card__title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #1a3353;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .poi-card__meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .poi-card__meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6c757d;
        }

        .poi-card__meta-item i {
          font-size: 14px;
        }

        .poi-card__meta-item--likes i {
          color: #e74c3c;
        }

        .poi-card__description {
          font-size: 14px;
          color: #6c757d;
          line-height: 1.6;
          margin: 0;
        }

        .poi-carousel__button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.3s ease;
          color: #1a3353;
          font-size: 18px;
        }

        .poi-carousel__button:hover {
          background: #1a3353;
          color: white;
          transform: translateY(-50%) scale(1.1);
        }

        .poi-carousel__button--prev {
          left: -24px;
        }

        .poi-carousel__button--next {
          right: -24px;
        }

        .poi-carousel__button--disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .poi-carousel__button--disabled:hover {
          background: white;
          color: #1a3353;
          transform: translateY(-50%);
        }

        @media (max-width: 1200px) {
          .poi-carousel__button--prev {
            left: 10px;
          }
          .poi-carousel__button--next {
            right: 10px;
          }
        }

        .poi-carousel__dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .poi-carousel__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #cbd5e0;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .poi-carousel__dot:hover {
          background: #a0aec0;
          transform: scale(1.2);
        }

        .poi-carousel__dot--active {
          background: #1a3353;
          width: 24px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default POICarousel;
