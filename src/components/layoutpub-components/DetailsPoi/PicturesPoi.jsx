import React, { useCallback, useEffect, useState } from "react";
import { Image } from "antd";
import { CLOUDFRONT_URL } from "../../../constants/ApiConstant";
import useEmblaCarousel from "embla-carousel-react";
import { Thumb } from "./Thumb";
import { useSelector } from "react-redux";
import IntlMessage from "../../util-components/IntlMessage";
import Head from 'next/head';
import Breadcrumbs from "./Breadcrumbs";

const PicturesPoi = ({ poi, mapRef }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [address, setAddress] = useState("");
  const { locale } = useSelector((state) => state.theme);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const scrollPrevThumb = useCallback(() => {
    if (emblaThumbsApi) emblaThumbsApi.scrollPrev();
  }, [emblaThumbsApi]);

  const scrollNextThumb = useCallback(() => {
    if (emblaThumbsApi) emblaThumbsApi.scrollNext();
  }, [emblaThumbsApi]);

  const scrollPrevMain = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNextMain = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (poi && typeof window !== 'undefined') {
      const geoJson = JSON.parse(poi.geoJson);

      // Dynamic import of react-geocode for client-side only
      import('react-geocode').then(({ geocode, RequestType }) => {
        import('../../../constants/MapConstant').then(({ API_KEY }) => {
          geocode(
            RequestType.LATLNG,
            `${geoJson.coordinates[1]}, ${geoJson.coordinates[0]}`,
            {
              key: API_KEY,
              language: locale,
              region: "eu",
            }
          )
            .then((res) => {
              const { results } = res;
              if (results.length > 0) setAddress(results[0].formatted_address);
              else setAddress(null);
            })
            .catch(() => setAddress(null));
        });
      });
    }
  }, [poi, locale]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const images = [
    poi.immagine,
    ...Array.from(poi.audioMediaItems.items, (x) => x.immagine),
  ];

  // Breadcrumbs data
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Guide', href: '/guide/pub' },
    { label: 'Dettaglio', href: '#' }
  ];

  return (
    <>
      <Head>
        <title>{poi.titolo}</title>
        <meta name="description" content={'Contenuti multimediali sul punto di interesse ' + poi.titolo} />
        <meta name="keywords" content={poi.titolo} />
      </Head>

      {/* Hero Section with Integrated Carousel */}
      <section className="hero-section">
        {/* Breadcrumbs at top */}
        <div className="breadcrumb-wrapper">
          <div className="container">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        {/* Carousel Images */}
        <div className="hero-carousel">
          <div className="embla__viewport" ref={emblaMainRef}>
            <div className="embla__container">
              {images.map((img, i) => (
                <div className="embla__slide" key={i}>
                  <Image
                    preview={false}
                    src={`${CLOUDFRONT_URL}/images/${img}`}
                    alt={poi.titolo}
                    className="hero-image"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="hero-overlay"></div>

          {/* Main Carousel Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button className="carousel-nav-btn carousel-prev" onClick={scrollPrevMain}>
                <i className="fa fa-chevron-left"></i>
              </button>
              <button className="carousel-nav-btn carousel-next" onClick={scrollNextMain}>
                <i className="fa fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>

        {/* Content Over Images */}
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">{poi.titolo}</h1>

            <div className="hero-meta">
              <a
                href="#poimap"
                className="hero-location"
                onClick={(e) => {
                  e.preventDefault();
                  if (mapRef?.current) {
                    window.scrollTo({
                      top: mapRef.current.offsetTop,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <i className="fa fa-map-marker"></i>
                <span>{address || <IntlMessage id="channel.address.poi" />}</span>
              </a>
            </div>

            <div className="hero-actions">
              <button className="action-btn" title="Condividi">
                <i className="fa fa-share-alt"></i>
                <span>Condividi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnails Navigation */}
        <div className="thumbnails-wrapper">
          <div className="container">
            <div className="thumbnails-nav-container">
              {images.length > 4 && (
                <button className="thumb-nav-btn thumb-nav-prev" onClick={scrollPrevThumb}>
                  <i className="fa fa-chevron-left"></i>
                </button>
              )}

              <div className="embla-thumbs">
                <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                  <div className="embla-thumbs__container">
                    {images.map((img, i) => (
                      <Thumb
                        key={i}
                        onClick={() => onThumbClick(i)}
                        selected={i === selectedIndex}
                        imgUrl={`${CLOUDFRONT_URL}/images/${img}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {images.length > 4 && (
                <button className="thumb-nav-btn thumb-nav-next" onClick={scrollNextThumb}>
                  <i className="fa fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 600px;
          margin-bottom: 40px;
          background: #000;
        }

        .breadcrumb-wrapper {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 3;
        }

        .hero-carousel {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Main Carousel Navigation Buttons */
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          color: #667eea;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          z-index: 2;
        }

        .carousel-nav-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .carousel-nav-btn:active {
          transform: translateY(-50%) scale(0.95);
        }

        .carousel-prev {
          left: 20px;
        }

        .carousel-next {
          right: 20px;
        }

        :global(.hero-carousel .embla__viewport) {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        :global(.hero-carousel .embla__container) {
          display: flex;
          height: 100%;
        }

        :global(.hero-carousel .embla__slide) {
          flex: 0 0 100%;
          min-width: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.hero-carousel .hero-image) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: absolute;
          bottom: 120px;
          left: 0;
          right: 0;
          z-index: 2;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 16px 0;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .hero-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .hero-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 16px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .hero-location:hover {
          color: #ffffff;
          transform: translateX(4px);
        }

        .hero-location i {
          font-size: 18px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .action-btn i {
          font-size: 16px;
        }

        .thumbnails-wrapper {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          z-index: 2;
        }

        .thumbnails-nav-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .thumb-nav-btn {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          color: #667eea;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .thumb-nav-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .thumb-nav-btn:active {
          transform: scale(0.95);
        }

        :global(.embla-thumbs) {
          flex: 1;
          overflow: hidden;
        }

        :global(.embla-thumbs__viewport) {
          overflow: hidden;
        }

        :global(.embla-thumbs__container) {
          display: flex;
          gap: 8px;
        }

        :global(.embla-thumbs__slide) {
          flex: 0 0 80px;
          min-width: 0;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          border: 3px solid transparent;
          transition: all 0.3s ease;
        }

        :global(.embla-thumbs__slide:hover) {
          border-color: rgba(255, 255, 255, 0.5);
        }

        :global(.embla-thumbs__slide--selected) {
          border-color: #667eea;
          box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
        }

        :global(.embla-thumbs__slide img) {
          width: 100%;
          height: 60px;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 500px;
          }

          .breadcrumb-wrapper {
            top: 12px;
          }

          .hero-content {
            bottom: 100px;
          }

          .hero-title {
            font-size: 32px;
          }

          .hero-location {
            font-size: 14px;
          }

          .action-btn span {
            display: none;
          }

          .action-btn {
            padding: 10px 16px;
          }

          .thumbnails-wrapper {
            bottom: 12px;
          }

          /* Carousel navigation buttons on mobile */
          .carousel-nav-btn {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .carousel-prev {
            left: 12px;
          }

          .carousel-next {
            right: 12px;
          }

          .thumb-nav-btn {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 450px;
          }

          .hero-title {
            font-size: 28px;
          }

          .hero-content {
            bottom: 90px;
          }
        }
      `}</style>
    </>
  );
};

export default PicturesPoi;
