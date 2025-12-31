import React, { useCallback, useEffect, useState } from "react";
import { Image } from "antd";
import { CLOUDFRONT_URL } from "../../../constants/ApiConstant";
import useEmblaCarousel from "embla-carousel-react";
import { Thumb } from "./Thumb";
import { useSelector } from "react-redux";
import IntlMessage from "../../util-components/IntlMessage";
import Head from 'next/head';

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

  return (
    <>
      <Head>
        <title>{poi.titolo}</title>
        <meta name="description" content={'Contenuti multimediali sul punto di interesse ' + poi.titolo} />
        <meta name="keywords" content={poi.titolo} />
      </Head>
      <section className="headings-2 pt-0">
        <div className="pro-wrapper">
          <div className="detail-wrapper-body">
            <div className="listing-title-bar">
              <h3>{poi.titolo}</h3>
              <div className="mt-0">
                <a
                  href="#poimap"
                  className="listing-address"
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
                  <i className="fa fa-map-marker pr-2 ti-location-pin mrg-r-5"></i>
                  {address || <IntlMessage id="channel.address.poi" />}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
