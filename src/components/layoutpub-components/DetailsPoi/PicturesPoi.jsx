import React, { useCallback, useEffect, useState } from "react";
import { Image, message, Modal } from "antd";
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
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
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

  // Share functionality
  const handleShare = async () => {
    // Prevent multiple simultaneous share calls
    if (isSharing) return;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = poi.titolo;
    const shareText = `Scopri ${poi.titolo} su Civiglio`;

    // Detect if mobile device (prefer Web Share API on mobile only)
    const isMobile = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && window.innerWidth < 768)
    );

    // Use Web Share API only on mobile devices
    if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error - ignore
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Desktop or fallback: Show modal with social options
      setShareModalVisible(true);
    }
  };

  const copyToClipboard = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success('Link copiato negli appunti!');
      setShareModalVisible(false);
    } catch (err) {
      message.error('Errore nella copia del link');
    }
  };

  const shareOnSocial = (platform) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(poi.titolo);
    const shareText = encodeURIComponent(`Scopri ${poi.titolo} su Civiglio`);

    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${shareTitle}&body=${shareText}%20${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      setShareModalVisible(false);
    }
  };

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
              <button className="action-btn" title="Condividi" onClick={handleShare}>
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

      {/* Share Modal */}
      <Modal
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
        centered
        width={480}
        className="share-modal"
      >
        <div className="share-modal-content">
          <h3 className="share-title">Condividi</h3>
          <p className="share-subtitle">{poi.titolo}</p>

          <div className="social-buttons">
            <button className="social-btn whatsapp" onClick={() => shareOnSocial('whatsapp')}>
              <i className="fa fa-whatsapp"></i>
              <span>WhatsApp</span>
            </button>

            <button className="social-btn facebook" onClick={() => shareOnSocial('facebook')}>
              <i className="fa fa-facebook"></i>
              <span>Facebook</span>
            </button>

            <button className="social-btn twitter" onClick={() => shareOnSocial('twitter')}>
              <i className="fa fa-twitter"></i>
              <span>Twitter</span>
            </button>

            <button className="social-btn linkedin" onClick={() => shareOnSocial('linkedin')}>
              <i className="fa fa-linkedin"></i>
              <span>LinkedIn</span>
            </button>

            <button className="social-btn email" onClick={() => shareOnSocial('email')}>
              <i className="fa fa-envelope"></i>
              <span>Email</span>
            </button>

            <button className="social-btn copy" onClick={copyToClipboard}>
              <i className="fa fa-link"></i>
              <span>Copia Link</span>
            </button>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .share-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }

        .share-modal .ant-modal-body {
          padding: 32px;
        }

        .share-modal-content {
          text-align: center;
        }

        .share-title {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .share-subtitle {
          font-size: 14px;
          color: #6c757d;
          margin: 0 0 24px 0;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .social-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          color: #2d3748;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .social-btn i {
          font-size: 28px;
        }

        .social-btn.whatsapp:hover {
          background: #25D366;
          border-color: #25D366;
          color: #ffffff;
        }

        .social-btn.facebook:hover {
          background: #1877F2;
          border-color: #1877F2;
          color: #ffffff;
        }

        .social-btn.twitter:hover {
          background: #1DA1F2;
          border-color: #1DA1F2;
          color: #ffffff;
        }

        .social-btn.linkedin:hover {
          background: #0A66C2;
          border-color: #0A66C2;
          color: #ffffff;
        }

        .social-btn.email:hover {
          background: #EA4335;
          border-color: #EA4335;
          color: #ffffff;
        }

        .social-btn.copy:hover {
          background: #667eea;
          border-color: #667eea;
          color: #ffffff;
        }

        @media (max-width: 480px) {
          .social-buttons {
            grid-template-columns: repeat(2, 1fr);
          }

          .share-modal .ant-modal-body {
            padding: 24px 16px;
          }
        }
      `}</style>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 600px;
          margin-bottom: 40px;
          background: #000;
        }

        /* Hide global like-icon in hero section */
        .hero-section :global(.like-icon),
        .hero-section :global(span.like-icon) {
          display: none !important;
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
          max-width: 100%;
        }

        .hero-content :global(.container) {
          max-width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 16px 0;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          max-height: 120px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
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
          padding: 0 20px;
        }

        .thumbnails-wrapper :global(.container) {
          max-width: 100%;
          padding: 0;
        }

        .thumbnails-nav-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          max-width: 100%;
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
          min-width: 0;
        }

        :global(.embla-thumbs__viewport) {
          overflow: hidden;
          width: 100%;
        }

        :global(.embla-thumbs__container) {
          display: flex;
          gap: 8px;
          width: 100%;
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

        /* Desktop: Limit content width to prevent overlap with sidebar */
        @media (min-width: 992px) {
          .hero-content :global(.container) {
            max-width: 90%;
          }

          .hero-title {
            max-width: 95%;
          }
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
            max-height: 80px;
            -webkit-line-clamp: 2;
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
            padding: 0 12px;
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
            max-height: 70px;
            -webkit-line-clamp: 2;
          }

          .hero-content {
            bottom: 90px;
          }

          .thumbnails-wrapper {
            padding: 0 8px;
          }
        }
      `}</style>
    </>
  );
};

export default PicturesPoi;
