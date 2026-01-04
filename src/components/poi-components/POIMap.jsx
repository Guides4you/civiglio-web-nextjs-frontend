import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API } from 'aws-amplify';
import IntlMessage from '../util-components/IntlMessage';
import {
  GOOGLE_MAPS_API_KEY,
  DEFAULT_MAP_ZOOM,
  API_GEO_SEARCH
} from '../../constants/CiviglioConstants';
import { CLOUDFRONT_URL } from '../../constants/ApiConstant';
import { getPoi } from '../../graphql/poiQueries';

const GoogleMapReact = dynamic(
  () => import('google-map-react'),
  { ssr: false }
);

// InfoBox popup component
const InfoBox = ({ text, image, visible, clickFn }) => {
  const c = visible ? 'active' : '';
  return (
    <div className={`civ-infobox ${c}`}>
      <img src={`${CLOUDFRONT_URL}/images/${image}`} alt={text} />
      <div className="civ-infobox-caption">
        <h3>{text}</h3>
        <Button
          className="civ-infobox-button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            clickFn(e);
          }}
        >
          <IntlMessage id="poi.map.select" />
        </Button>
      </div>
    </div>
  );
};

// Nearby POI Marker with InfoBox
const NearbyMarker = ({ text, image, isActive, onToggle, onSelect }) => {
  const markerStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: '32px',
    cursor: 'pointer',
    zIndex: isActive ? 9998 : 1, // Higher z-index when active
  };

  return (
    <div
      style={markerStyle}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
    >
      <img
        src="/img/civiglio/pinrol.png"
        alt=""
        width={32}
      />
      <InfoBox
        text={text}
        image={image}
        visible={isActive}
        clickFn={(e) => {
          onSelect(); // Selection handler already closes infobox
        }}
      />
    </div>
  );
};

// Current location marker
const LocationMarker = ({ text, linkedPointer }) => {
  const markerStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: linkedPointer ? '18px' : '32px',
    cursor: 'pointer',
  };

  return (
    <div style={markerStyle}>
      {!linkedPointer ? (
        <img src="/img/mapcn.png" alt="marker" width={32} />
      ) : (
        <img src="/img/mapcw.png" alt="linked marker" width={18} />
      )}
    </div>
  );
};

const POIMap = ({ lat, lng, onMapClick, editable = true, title = '', linked = false }) => {
  const locale = useSelector((state) => state.theme.locale);
  const [center, setCenter] = useState({ lat: lat || 41.890321994610964, lng: lng || 12.492220169150155 });
  const [markerPos, setMarkerPos] = useState({ lat: lat || 41.890321994610964, lng: lng || 12.492220169150155 });
  const [isLinked, setIsLinked] = useState(linked);
  const [puntiVicini, setPuntiVicini] = useState([]);
  const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM + 4);
  const [zoomAlarm, setZoomAlarm] = useState(false);
  const [locked, setLocked] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [map, setMap] = useState(null);
  const [googlemaps, setGooglemaps] = useState(null);
  const [activeInfoboxIndex, setActiveInfoboxIndex] = useState(null);
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (lat && lng) {
      setCenter({ lat, lng });
      setMarkerPos({ lat, lng });
    }
  }, [lat, lng]);

  useEffect(() => {
    setIsLinked(linked);
  }, [linked]);

  // Search nearby POIs
  const searchGeoPoi = async (position) => {
    try {
      const response = await axios.get(
        `${API_GEO_SEARCH}?r=5000&lat=${position.lat}&lng=${position.lng}`
      );

      if (response.data && response.data.length > 0) {
        const na = [];

        for (let i = 0; i < response.data.length; i++) {
          const r = response.data[i];

          // Filter by public field BEFORE calling GraphQL (supports both BOOL and string)
          const isPublic = (r.public?.BOOL === true) || (r.public?.S === "true");

          if (!isPublic) {
            continue; // Skip non-public POIs
          }

          try {
            const poi = await API.graphql({
              query: getPoi,
              variables: {
                PK: r.rangeKey.S,
                SK: `_${locale}_POI`,
              },
            });

            if (!poi.data.getPoi) {
              // Fallback to Italian
              const poiIt = await API.graphql({
                query: getPoi,
                variables: {
                  PK: r.rangeKey.S,
                  SK: `_it_POI`,
                },
              });

              if (poiIt.data.getPoi) {
                na.push({
                  coord: JSON.parse(r.geoJson.S).coordinates,
                  rangeKey: r.rangeKey.S,
                  text: poiIt.data.getPoi.titolo || '',
                  immagine: poiIt.data.getGeoPoi.immagine,
                  hashKey: poiIt.data.getGeoPoi.hashKey,
                });
              }
            } else {
              na.push({
                hashKey: poi.data.getGeoPoi.hashKey,
                coord: JSON.parse(r.geoJson.S).coordinates,
                rangeKey: r.rangeKey.S,
                text: poi.data.getPoi.titolo,
                immagine: poi.data.getGeoPoi.immagine,
              });
            }
          } catch (err) {
            console.error('Error fetching POI:', err);
          }
        }

        setPuntiVicini(na);
      }
    } catch (error) {
      console.error('Error searching geo POI:', error);
    }
  };

  // Initialize SearchBox when API is ready
  useEffect(() => {
    if (apiReady && editable && googlemaps && searchInputRef.current) {
      const input = searchInputRef.current.input;

      if (input && googlemaps.places) {
        searchBoxRef.current = new googlemaps.places.SearchBox(input);

        searchBoxRef.current.addListener('places_changed', () => {
          const places = searchBoxRef.current.getPlaces();
          if (places && places.length > 0) {
            const place = places[0];
            const newPosition = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            searchGeoPoi(newPosition);
            if (map) {
              map.setCenter(newPosition);
            }
          }
        });
      }
    }

    return () => {
      if (searchBoxRef.current && googlemaps) {
        googlemaps.event.clearInstanceListeners(searchBoxRef.current);
      }
    };
  }, [apiReady, editable, googlemaps, map]);

  // Search nearby POIs on mount if editable
  useEffect(() => {
    if (editable && lat && lng) {
      searchGeoPoi({ lat, lng });
    }
  }, [editable]);

  const handleApiLoaded = ({ map, maps }) => {
    if (map && maps) {
      setTimeout(() => {
        setApiReady(true);
        setMap(map);
        setGooglemaps(maps);
      }, 400);
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    if (editable && !locked && onMapClick) {
      setMarkerPos({ lat, lng });
      setIsLinked(false);
      onMapClick({ lat, lng, linked: false });
    }
  };

  const handleNearbyMarkerClick = (p) => {
    if (editable && onMapClick) {
      const newPos = { lat: p.coord[1], lng: p.coord[0] };
      setMarkerPos(newPos);
      setIsLinked(true); // Mark as linked to existing POI
      setActiveInfoboxIndex(null); // Close all infoboxes
      onMapClick({
        lat: p.coord[1],
        lng: p.coord[0],
        linked: true,
        rangeKey: p.rangeKey,
        hashkey: p.hashKey,
      });
      if (map) {
        map.setCenter(newPos);
        setZoom(17);
      }
    }
  };

  const handleZoomChange = (newZoom) => {
    const alarm = newZoom < 16;
    setZoom(newZoom);
    setZoomAlarm(alarm);
    setLocked(alarm);
  };

  const inputStyle = {
    position: 'absolute',
    left: '12px',
    top: '12px',
    zIndex: 2,
    width: '300px',
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="ant-card-head">
        <div className="ant-card-head-title" style={{ paddingBottom: '8px' }}>
          <IntlMessage id="poidetail3.cerca.il.tuo.luogo.sulla.mappa" />
        </div>
      </div>

      {apiReady && editable && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Input
            ref={searchInputRef}
            type="text"
            style={inputStyle}
            placeholder="Cerca indirizzo..."
          />
        </div>
      )}

      {zoomAlarm && (
        <div className="noeditmap">
          <IntlMessage id="gmapciviglio.aumentare.lo.zoom.per.impostare.il.punto.sulla.mappa" />
        </div>
      )}

      <div
        className={`gmap-insert-poi ${zoomAlarm ? 'zoom-alarm' : ''}`}
        style={{
          height: '400px',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          marginTop: '8px',
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'it',
            libraries: ['places'],
            region: 'it',
          }}
          center={center}
          zoom={zoom}
          onClick={handleMapClick}
          onZoomAnimationEnd={handleZoomChange}
          onGoogleApiLoaded={handleApiLoaded}
          options={{
            zoomControl: editable,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
          }}
          yesIWantToUseGoogleMapApiInternals
        >
          {/* Current location marker */}
          <LocationMarker
            lat={markerPos.lat}
            lng={markerPos.lng}
            text={title || 'POI Location'}
            linkedPointer={isLinked}
          />

          {/* Nearby POI markers */}
          {puntiVicini.map((p, i) => (
            <NearbyMarker
              key={i}
              lat={p.coord[1]}
              lng={p.coord[0]}
              text={p.text}
              image={p.immagine}
              isActive={activeInfoboxIndex === i}
              onToggle={() => setActiveInfoboxIndex(activeInfoboxIndex === i ? null : i)}
              onSelect={() => handleNearbyMarkerClick(p)}
            />
          ))}
        </GoogleMapReact>
      </div>

      <style jsx global>{`
        .civ-infobox {
          display: none;
          width: 150px;
          height: 150px;
          background-color: transparent;
          position: absolute;
          top: -170px;
          left: -75px;
          box-shadow: rgba(0,0,0, 0.2) 0px 1px 4px;
          border-radius: 8px;
          z-index: 1;
        }

        .civ-infobox.active {
          display: block;
          z-index: 9999;
        }

        .civ-infobox img {
          border-radius: 8px;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .civ-infobox-caption {
          position: absolute;
          background-color: rgba(0,0,0,0.6);
          bottom: 0px;
          left: 0px;
          height: 50%;
          width: 100%;
          padding: 8px;
          border-radius: 0 0 8px 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .civ-infobox-caption h3 {
          color: white;
          margin: 0;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .civ-infobox-button {
          width: 100%;
          font-size: 11px;
          height: 24px;
          padding: 0 8px;
        }

        .civ-infobox:before {
          position: absolute;
          margin-left: 50%;
          bottom: -10px;
          left: -12px;
          content: '';
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid rgba(0, 0, 0, 0.70);
          z-index: 2;
        }

        .noeditmap {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff4d4f;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          z-index: 3;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .zoom-alarm {
          border: 3px solid #ff4d4f;
        }

        .gmap-insert-poi {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default POIMap;
