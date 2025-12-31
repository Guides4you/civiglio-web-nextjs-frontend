import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { CLOUDFRONT_URL } from '../../../constants/ApiConstant';
import { APP_PUBLIC_PATH } from '../../../configs/AppConfig';

/**
 * POICarouselAdvanced - Enhanced version with progress bar and advanced features
 * Additional features over base POICarousel:
 * - Autoplay progress bar
 * - Pause/play button
 * - Slide counter
 * - Enhanced animations
 * - Thumbnail navigation (optional)
 */
const POICarouselAdvanced = ({
  pois = [],
  autoplayDelay = 5000,
  title,
  subtitle,
  showProgress = true,
  showCounter = true,
  showThumbnails = false
}) => {
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
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  // Auto-play with progress bar
  useEffect(() => {
    if (!emblaApi || !isAutoPlaying || autoplayDelay === 0) {
      setProgress(0);
      return;
    }

    // Reset progress
    setProgress(0);

    // Progress animation
    const progressStep = 50; // Update every 50ms
    const progressIncrement = (progressStep / autoplayDelay) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + progressIncrement;
      });
    }, progressStep);

    // Auto-advance slides
    autoplayIntervalRef.current = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
      setProgress(0);
    }, autoplayDelay);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [emblaApi, isAutoPlaying, autoplayDelay]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setProgress(0);
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setProgress(0);
    }
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        setProgress(0);
      }
    },
    [emblaApi]
  );

  const toggleAutoplay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
    setProgress(0);
  }, []);

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
    <div className="poi-carousel-advanced">
      <div className="container">
        <div className="carousel-header">
          {title && <h2 className="carousel-title">{title}</h2>}
          {subtitle && <p className="carousel-subtitle">{subtitle}</p>}

          {showCounter && (
            <div className="carousel-counter">
              <span className="current">{selectedIndex + 1}</span>
              <span className="separator">/</span>
              <span className="total">{pois.length}</span>
            </div>
          )}
        </div>

        <div
          className="carousel-main"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {showProgress && autoplayDelay > 0 && (
            <div className="carousel-progress-bar">
              <div
                className="carousel-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="carousel-viewport" ref={emblaRef}>
            <div className="carousel-container">
              {pois.map((poi, index) => {
                const firstAudio = poi.audioMediaItems?.items?.[0];
                if (!firstAudio) return null;

                const poiId = firstAudio.PK || poi.rangeKey;
                const titolo = encodeURI(
                  (firstAudio.audioTitle || poi.title || 'dettaglio').replace(/\s/g, '-')
                );
                const detailUrl = `${APP_PUBLIC_PATH}/pub/detail/${poiId}/${titolo}`;

                return (
                  <div className="carousel-slide" key={index}>
                    <Link href={detailUrl} className="poi-card-advanced">
                      <div className="card-image-wrapper">
                        {poi.immagine ? (
                          <img
                            src={`${CLOUDFRONT_URL}/images/${poi.immagine}`}
                            alt={firstAudio.audioTitle || poi.title}
                            className="card-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="card-image-placeholder">
                            <i className="fa fa-map-marker"></i>
                          </div>
                        )}
                        <div className="card-badge">
                          <i className="fa fa-music"></i>
                          {poi.audioMediaItems?.items?.length || 0}
                        </div>
                        <div className="card-overlay">
                          <div className="overlay-content">
                            <i className="fa fa-play-circle"></i>
                            <span>Ascolta</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-content">
                        <h5 className="card-title">
                          {firstAudio.audioTitle || poi.title || 'POI'}
                        </h5>
                        {firstAudio.abstract && (
                          <p className="card-description">
                            {firstAudio.abstract.substring(0, 120)}
                            {firstAudio.abstract.length > 120 ? '...' : ''}
                          </p>
                        )}
                        <div className="card-footer">
                          {poi.likes > 0 && (
                            <span className="card-likes">
                              <i className="fa fa-heart"></i>
                              {poi.likes}
                            </span>
                          )}
                          <span className="card-cta">
                            Scopri di più
                            <i className="fa fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="carousel-controls">
            <button
              className="control-btn control-btn--prev"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous slide"
            >
              <i className="fa fa-chevron-left"></i>
            </button>

            {autoplayDelay > 0 && (
              <button
                className="control-btn control-btn--play"
                onClick={toggleAutoplay}
                aria-label={isAutoPlaying ? 'Pause' : 'Play'}
              >
                <i className={`fa fa-${isAutoPlaying ? 'pause' : 'play'}`}></i>
              </button>
            )}

            <button
              className="control-btn control-btn--next"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next slide"
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="carousel-pagination">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Optional Thumbnails */}
        {showThumbnails && (
          <div className="carousel-thumbnails">
            {pois.slice(0, 5).map((poi, index) => (
              <button
                key={index}
                className={`thumbnail ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => scrollTo(index)}
              >
                {poi.immagine && (
                  <img
                    src={`${CLOUDFRONT_URL}/images/${poi.immagine}`}
                    alt={poi.title}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .poi-carousel-advanced {
          padding: 60px 0;
          background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
        }

        .carousel-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .carousel-title {
          font-size: 36px;
          font-weight: 700;
          color: #1a3353;
          margin-bottom: 10px;
        }

        .carousel-subtitle {
          font-size: 18px;
          color: #6c757d;
        }

        .carousel-counter {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a3353;
          background: white;
          padding: 8px 16px;
          border-radius: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .carousel-counter .current {
          font-size: 24px;
          color: #667eea;
        }

        .carousel-counter .separator {
          margin: 0 8px;
          color: #cbd5e0;
        }

        .carousel-main {
          position: relative;
          margin-bottom: 32px;
        }

        .carousel-progress-bar {
          position: absolute;
          top: -8px;
          left: 0;
          right: 0;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          z-index: 5;
        }

        .carousel-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.05s linear;
        }

        .carousel-viewport {
          overflow: hidden;
          border-radius: 16px;
        }

        .carousel-container {
          display: flex;
          gap: 24px;
          margin-left: -12px;
        }

        .carousel-slide {
          flex: 0 0 calc(33.333% - 16px);
          min-width: 0;
          padding: 0 12px;
        }

        @media (max-width: 1024px) {
          .carousel-slide {
            flex: 0 0 calc(50% - 12px);
          }
        }

        @media (max-width: 640px) {
          .carousel-slide {
            flex: 0 0 100%;
          }
          .carousel-counter {
            position: static;
            display: inline-block;
            margin-top: 16px;
          }
        }

        .poi-card-advanced {
          display: block;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
        }

        .poi-card-advanced:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-image-wrapper {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .poi-card-advanced:hover .card-image {
          transform: scale(1.15);
        }

        .card-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          color: rgba(255, 255, 255, 0.5);
        }

        .card-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(10px);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(102, 126, 234, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .poi-card-advanced:hover .card-overlay {
          opacity: 1;
        }

        .overlay-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          transform: translateY(20px);
          transition: transform 0.4s ease;
        }

        .poi-card-advanced:hover .overlay-content {
          transform: translateY(0);
        }

        .overlay-content i {
          font-size: 48px;
        }

        .card-content {
          padding: 24px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a3353;
          margin: 0 0 12px 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .card-description {
          font-size: 14px;
          color: #718096;
          line-height: 1.7;
          margin: 0 0 16px 0;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-likes {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #e53e3e;
        }

        .card-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
          transition: gap 0.3s ease;
        }

        .poi-card-advanced:hover .card-cta {
          gap: 12px;
        }

        .carousel-controls {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .control-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a3353;
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .control-btn:hover:not(:disabled) {
          background: #667eea;
          color: white;
          transform: scale(1.1);
        }

        .control-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .control-btn--play {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .carousel-pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .pagination-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #cbd5e0;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .pagination-dot:hover {
          background: #a0aec0;
          transform: scale(1.3);
        }

        .pagination-dot.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 32px;
          border-radius: 6px;
        }

        .carousel-thumbnails {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
          background: #e2e8f0;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail:hover {
          border-color: #667eea;
          transform: scale(1.1);
        }

        .thumbnail.active {
          border-color: #667eea;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </div>
  );
};

export default POICarouselAdvanced;
