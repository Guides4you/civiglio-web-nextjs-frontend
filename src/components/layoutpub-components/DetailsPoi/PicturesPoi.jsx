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

      {/* Modern Hero Section */}
      <section className="hero-section">
        <div className="hero-image-wrapper">
          <Image
            preview={false}
            src={`${CLOUDFRONT_URL}/images/${poi.immagine}`}
            alt={poi.titolo}
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="container">
            <Breadcrumbs items={breadcrumbItems} />

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
              <button className="action-btn" title="Salva nei preferiti">
                <i className="fa fa-heart-o"></i>
                <span>Salva</span>
              </button>
              <button className="action-btn" title="Scarica">
                <i className="fa fa-download"></i>
                <span>Scarica</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 500px;
          margin-bottom: 40px;
          overflow: hidden;
        }

        .hero-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        :global(.hero-image) {
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
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
        }

        .hero-content {
          position: relative;
          height: 100%;
          display: flex;
          align-items: flex-end;
          padding-bottom: 40px;
          z-index: 1;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin: 16px 0;
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

        @media (max-width: 768px) {
          .hero-section {
            height: 400px;
          }

          .hero-content {
            padding-bottom: 24px;
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
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 350px;
          }

          .hero-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="embla">
        <div className="embla__viewport" ref={emblaMainRef}>
          <div className="embla__container">
            {images.map((img, i) => (
              <div className="embla__slide" key={i}>
                <center>
                  <Image
                    preview={false}
                    width={"auto"}
                    src={`${CLOUDFRONT_URL}/images/${img}`}
                    alt={poi.titolo}
                    className="img-fluid"
                  />
                </center>
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </>
  );
};

export default PicturesPoi;
