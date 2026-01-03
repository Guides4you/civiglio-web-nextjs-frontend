import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { message, Spin } from 'antd';
import axios from 'axios';
import supercluster from 'points-cluster';
import { API_KEY, DEFAULT_ZOOM } from '../../../constants/MapConstant';
import { CLOUDFRONT_URL, API_GEO_SEARCH } from '../../../constants/ApiConstant';
import SearchBox from './SearchBox';
import RadiusSelector from './RadiusSelector';
import ClusterMarker from './ClusterMarker';

// Import dinamico per SSR
const GoogleMapReact = dynamic(
  () => import('google-map-react'),
  { ssr: false }
);

const Marker = ({ lat, lng, poi, onClick, isNew, isUser, isOpen, onToggleInfo }) => {
  const [animate, setAnimate] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Marker posizione utente (blu)
  if (isUser) {
    return (
      <div
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#4285f4',
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(66, 133, 244, 0.6)',
            animation: 'pulse 2s infinite'
          }}
        />
      </div>
    );
  }

  // Marker POI normale
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        cursor: 'pointer',
        animation: animate ? 'markerBounce 0.6s ease-out' : 'none',
        zIndex: isOpen ? 9998 : 1
      }}
    >
      <img
        src="/img/civiglio/pinrol.png"
        alt="POI"
        width={25}
        onClick={(e) => {
          e.stopPropagation();
          onToggleInfo && onToggleInfo();
        }}
      />
      {isOpen && poi && (
        <div
          style={{
            position: 'absolute',
            bottom: '35px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            padding: '12px',
            paddingTop: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            minWidth: '200px',
            zIndex: 9999,
            whiteSpace: 'normal'
          }}
        >
          {/* Close button (X) - Top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo && onToggleInfo();
            }}
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '24px',
              height: '24px',
              border: 'none',
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              lineHeight: '1',
              color: '#666',
              transition: 'all 0.2s ease',
              padding: '0'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.1)';
              e.target.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.05)';
              e.target.style.color = '#666';
            }}
            title="Chiudi"
          >
            ×
          </button>

          {poi.immagine && (
            <img
              src={`${CLOUDFRONT_URL}/images/${poi.immagine}`}
              alt={poi.audioMediaItems?.items?.[0]?.audioTitle || poi.titolo || ''}
              style={{ width: '100%', borderRadius: '4px', marginBottom: '8px' }}
            />
          )}
          <h6 style={{ margin: '0 0 8px 0', fontSize: '14px', paddingRight: '8px' }}>
            {poi.audioMediaItems?.items?.[0]?.audioTitle || poi.titolo || 'POI'}
          </h6>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(poi);
            }}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#764ba2'}
            onMouseLeave={(e) => e.target.style.background = '#667eea'}
          >
            Vai al dettaglio
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * GMapCiviglioHome Component - Top-tier design
 *
 * Features:
 * - Google Maps integration with markers
 * - Address search with Google Places Autocomplete
 * - Dynamic POI search based on location
 * - Radius selector for search area
 * - Loading states and animations
 * - Interactive POI markers with info windows
 * - Responsive design
 */
const GMapCiviglioHome = ({ pois: initialPois = [] }) => {
  const router = useRouter();
  const [center, setCenter] = useState({ lat: 41.9102415, lng: 12.3959153 }); // Roma default
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [nearbyPois, setNearbyPois] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newMarkerIds, setNewMarkerIds] = useState(new Set());
  const [userPosition, setUserPosition] = useState(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);
  const [openMarkerId, setOpenMarkerId] = useState(null); // Track which marker info window is open
  const [mapOptions, setMapOptions] = useState({
    center: { lat: 41.9102415, lng: 12.3959153 }, // Roma default
    zoom: DEFAULT_ZOOM,
    bounds: null
  });

  // Rimosso useEffect per initialPois - ora usiamo solo geolocalizzazione e ricerca manuale

  // Debug: Log quando nearbyPois cambia
  useEffect(() => {
    console.log('🔄 nearbyPois state changed:', nearbyPois);
    console.log('📊 nearbyPois count:', nearbyPois.length);
    if (nearbyPois.length > 0) {
      console.log('📍 First nearby POI:', nearbyPois[0]);
      console.log('📍 Coordinates of first POI:', {
        lat: nearbyPois[0].lat,
        lng: nearbyPois[0].lng
      });
    }
  }, [nearbyPois]);

  // Geolocalizzazione automatica al primo caricamento
  useEffect(() => {
    if (apiReady && !hasAutoSearched) {
      console.log('🌍 API Ready - Starting automatic geolocation...');
      getUserPosition();
    }
  }, [apiReady, hasAutoSearched]);

  const getUserPosition = () => {
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation is not supported by this browser');
      message.warning('Geolocalizzazione non disponibile');
      return;
    }

    setIsGeolocating(true);
    console.log('📍 Requesting user position...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Geolocation success:', position.coords);

        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setUserPosition(userLoc);
        setCenter(userLoc);
        setZoom(13);
        setHasAutoSearched(true);

        // Centra la mappa
        if (map) {
          map.setCenter(userLoc);
          map.setZoom(13);
        }

        // Cerca automaticamente i POI nelle vicinanze
        console.log('🔍 Auto-searching POIs near user location...');
        searchNearbyPOIs(userLoc);

        setIsGeolocating(false);
        message.success('Posizione rilevata! Caricamento POI nelle vicinanze...');
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        setIsGeolocating(false);
        setHasAutoSearched(true);

        let errorMessage = 'Impossibile rilevare la posizione';

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permesso di geolocalizzazione negato';
            console.warn('⚠️ User denied geolocation permission');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Posizione non disponibile';
            console.warn('⚠️ Position unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout nella richiesta di geolocalizzazione';
            console.warn('⚠️ Geolocation timeout');
            break;
          default:
            console.warn('⚠️ Unknown geolocation error');
        }

        message.info(errorMessage + '. Usa la ricerca per trovare POI.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleApiLoaded = ({ map, maps }) => {
    setMap(map);
    setMaps(maps);
    setApiReady(true);
  };

  const searchNearbyPOIs = async (location, radius = searchRadius) => {
    setIsSearching(true);

    try {
      // Chiamata API per cercare POI vicini
      const response = await axios.get(
        `${API_GEO_SEARCH}?r=${radius}&lat=${location.lat}&lng=${location.lng}`
      );

      console.log('🔍 API_GEO_SEARCH Response:', response.data);
      console.log('📊 Number of POIs found:', response.data?.length || 0);

      if (response.data && response.data.length > 0) {
        // Filter only public POIs (supports both BOOL and string formats)
        const publicPOIs = response.data.filter(poi => {
          const isPublic = (poi.public?.BOOL === true) || (poi.public?.S === "true");
          return isPublic;
        });

        console.log('📊 Public POIs found:', publicPOIs.length);

        // Import dinamico di Amplify
        const { API } = await import('aws-amplify');
        const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api');

        // Query per ottenere dettagli POI
        const getPoi = `
          query GetPoi($rangeKey: String!, $SK: String!) {
            getPoi(PK: $rangeKey, SK: $SK) {
              PK
              SK
              titolo
            }
            getGeoPoi(rangeKey: $rangeKey) {
              rangeKey
              immagine
              hashKey
              geoJson
            }
          }
        `;

        const poisDetails = await Promise.all(
          publicPOIs.map(async (geoPoiData, index) => {
            try {
              console.log(`\n🔄 Processing POI ${index + 1}/${publicPOIs.length}`);
              console.log('📍 GeoPoiData:', geoPoiData);

              const variables = {
                rangeKey: geoPoiData.rangeKey.S,
                SK: '_it_POI'
              };

              console.log('📤 GraphQL Variables:', variables);

              // Prova con lingua italiana
              const result = await API.graphql({
                query: getPoi,
                variables: variables,
                authMode: GRAPHQL_AUTH_MODE.API_KEY
              });

              console.log('✅ GraphQL Result:', result);
              console.log('✅ GraphQL Data:', result.data);

              if (result.data?.getPoi && result.data?.getGeoPoi) {
                // Usa il geoJson dal risultato GraphQL, non da geoPoiData
                const geoJsonString = result.data.getGeoPoi.geoJson || geoPoiData.geoJson?.S;

                if (!geoJsonString) {
                  console.error('❌ No geoJson found for POI:', geoPoiData.rangeKey.S);
                  return null;
                }

                const geoJsonParsed = JSON.parse(geoJsonString);
                const coords = geoJsonParsed.coordinates;

                console.log('📍 Coordinates:', { lat: coords[1], lng: coords[0] });

                const poiObject = {
                  rangeKey: geoPoiData.rangeKey.S,
                  titolo: result.data.getPoi.titolo,
                  descrizione: result.data.getPoi.descrizione,
                  immagine: result.data.getGeoPoi.immagine,
                  hashKey: result.data.getGeoPoi.hashKey,
                  geoJson: geoJsonString,
                  lat: coords[1],
                  lng: coords[0]
                };

                console.log('✅ POI Object created:', poiObject);
                return poiObject;
              }

              console.warn('⚠️ Missing getPoi or getGeoPoi data');
              return null;
            } catch (error) {
              console.error('❌ Error fetching POI details:', error);
              console.error('❌ Error details:', JSON.stringify(error, null, 2));
              if (error.errors) {
                console.error('❌ GraphQL Errors:', error.errors);
                error.errors.forEach((err, idx) => {
                  console.error(`❌ Error ${idx + 1}:`, err.message || err);
                });
              }
              return null;
            }
          })
        );

        const validPois = poisDetails.filter(Boolean);

        console.log('\n📦 Valid POIs:', validPois);
        console.log('📊 Valid POIs count:', validPois.length);

        // Identifica nuovi marker per animazione
        const newIds = new Set(validPois.map(p => p.rangeKey));
        setNewMarkerIds(newIds);

        // Resetta animazione dopo 600ms
        setTimeout(() => setNewMarkerIds(new Set()), 600);

        setNearbyPois(validPois);
        console.log('✅ nearbyPois state updated with', validPois.length, 'POIs');

        message.success(`${validPois.length} POI trovati nel raggio di ${radius/1000}km`);
      } else {
        setNearbyPois([]);
        message.info('Nessun POI trovato in questa area');
      }
    } catch (error) {
      console.error('❌ Error searching nearby POIs:', error);
      message.error('Errore durante la ricerca dei POI');
      setNearbyPois([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlaceSelected = (location) => {
    console.log('Place selected:', location);
    setCenter({ lat: location.lat, lng: location.lng });
    setZoom(15);

    // Cerca POI vicini alla nuova posizione
    searchNearbyPOIs(location);
  };

  const handleRadiusChange = (newRadius) => {
    setSearchRadius(newRadius);

    // Re-search con il nuovo raggio se c'è un centro attivo
    if (nearbyPois.length > 0 || center.lat !== 41.9102415) {
      searchNearbyPOIs(center, newRadius);
    }
  };

  const handleMarkerClick = (poi) => {
    // Gestisce sia POI iniziali che POI cercati
    if (poi.audioMediaItems?.items?.[0]) {
      const firstAudio = poi.audioMediaItems.items[0];
      const poiId = firstAudio.PK || poi.rangeKey;
      const titolo = encodeURI((firstAudio.audioTitle || 'dettaglio').replace(/\s/g, '-'));
      router.push(`/guide/pub/detail/${poiId}/${titolo}`);
    } else if (poi.rangeKey) {
      // POI cercato
      const titolo = encodeURI((poi.titolo || 'dettaglio').replace(/\s/g, '-'));
      router.push(`/guide/pub/detail/${poi.rangeKey}/${titolo}`);
    }
  };

  // Combina marker utente e POI cercati (NO POI iniziali)
  const allMarkers = [
    // Marker posizione utente (se disponibile)
    ...(userPosition ? [{
      id: 'user-position',
      lat: userPosition.lat,
      lng: userPosition.lng,
      poi: null,
      isUser: true,
      isNew: false
    }] : []),
    // POI cercati dalla geolocalizzazione o ricerca manuale
    ...nearbyPois.map((poi, index) => ({
      id: `nearby-${poi.rangeKey || index}`,
      lat: poi.lat,
      lng: poi.lng,
      poi,
      isNew: newMarkerIds.has(poi.rangeKey)
    }))
  ];

  // Calcola clusters con useMemo (evita ricalcolo ad ogni render)
  const clusters = useMemo(() => {
    const markers = allMarkers.filter(m => !m.isUser);

    if (!mapOptions.bounds || markers.length === 0) {
      return [];
    }

    // Prepara i dati per supercluster
    const points = markers.map(m => ({
      lat: m.lat,
      lng: m.lng,
      id: m.id,
      poi: m.poi,
      isNew: m.isNew
    }));

    // Crea cluster function
    const clustersFn = supercluster(points, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    });

    // Calcola bounds
    const bounds = mapOptions.bounds;
    const zoom = mapOptions.zoom;

    const nw = bounds.ne && bounds.sw ? {
      lat: bounds.ne.lat,
      lng: bounds.sw.lng
    } : null;

    const se = bounds.ne && bounds.sw ? {
      lat: bounds.sw.lat,
      lng: bounds.ne.lng
    } : null;

    if (!nw || !se) return [];

    // Ottieni clusters
    const rawClusters = clustersFn({
      bounds: { nw, se },
      zoom
    });

    return rawClusters.map(({ wx, wy, numPoints, points }) => ({
      lat: wy,
      lng: wx,
      numPoints,
      id: `${numPoints}_${points[0]?.id || Math.random()}`,
      points,
    }));
  }, [allMarkers, mapOptions.bounds, mapOptions.zoom, nearbyPois.length, userPosition]);

  // Debug: Log markers
  console.log('🗺️ Rendering markers - Total:', allMarkers.length);
  console.log('🗺️ nearbyPois.length:', nearbyPois.length);
  console.log('🗺️ userPosition:', userPosition);
  console.log('🗺️ Clusters:', clusters.length);
  console.log('🗺️ All markers:', allMarkers.map(m => ({
    id: m.id,
    lat: m.lat,
    lng: m.lng,
    isUser: m.isUser,
    title: m.poi?.titolo || 'User Position'
  })));

  return (
    <>
      <div className="map-container">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: API_KEY,
            language: 'it',
            region: 'it',
            libraries: ['places']
          }}
          center={center}
          zoom={zoom}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ]
          }}
          onChange={({ center, zoom, bounds }) => {
            setCenter(center);
            setZoom(zoom);

            // Aggiorna bounds per clustering
            if (bounds) {
              setMapOptions(prev => ({
                ...prev,
                center,
                zoom,
                bounds: {
                  ne: { lat: bounds.ne.lat, lng: bounds.ne.lng },
                  sw: { lat: bounds.sw.lat, lng: bounds.sw.lng }
                }
              }));
            }
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={handleApiLoaded}
        >
          {/* User Position Marker (sempre singolo) */}
          {userPosition && (
            <Marker
              key="user-position"
              lat={userPosition.lat}
              lng={userPosition.lng}
              poi={null}
              onClick={() => {}}
              isNew={false}
              isUser={true}
              isOpen={false}
              onToggleInfo={() => {}}
            />
          )}

          {/* Clusters o Marker singoli */}
          {clusters.map((cluster) => {
            // Se il cluster ha più di 1 punto, mostra ClusterMarker
            if (cluster.numPoints > 1) {
              return (
                <ClusterMarker
                  key={cluster.id}
                  lat={cluster.lat}
                  lng={cluster.lng}
                  points={cluster.points}
                  onClick={({ lat, lng }) => {
                    // Zoom in quando si clicca sul cluster
                    if (map) {
                      map.setCenter({ lat, lng });
                      map.setZoom(mapOptions.zoom + 2);
                    }
                  }}
                />
              );
            }

            // Se il cluster ha 1 solo punto, mostra Marker normale
            const point = cluster.points[0];
            return (
              <Marker
                key={point.id}
                lat={point.lat}
                lng={point.lng}
                poi={point.poi}
                onClick={handleMarkerClick}
                isNew={point.isNew}
                isUser={false}
                isOpen={openMarkerId === point.id}
                onToggleInfo={() => {
                  // Toggle: se già aperto, chiudi; altrimenti apri e chiudi gli altri
                  setOpenMarkerId(openMarkerId === point.id ? null : point.id);
                }}
              />
            );
          })}
        </GoogleMapReact>

        {/* Search Box */}
        {apiReady && map && maps && (
          <SearchBox
            map={map}
            maps={maps}
            onPlaceSelected={handlePlaceSelected}
            placeholder="Cerca un indirizzo o luogo..."
          />
        )}

        {/* Radius Selector */}
        {apiReady && (
          <RadiusSelector
            value={searchRadius}
            onChange={handleRadiusChange}
          />
        )}

        {/* Geolocation Overlay */}
        {isGeolocating && (
          <div className="map-loading-overlay">
            <div className="map-loading-content">
              <Spin size="large" />
              <p>Rilevamento posizione in corso...</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isSearching && !isGeolocating && (
          <div className="map-loading-overlay">
            <div className="map-loading-content">
              <Spin size="large" />
              <p>Ricerca POI in corso...</p>
            </div>
          </div>
        )}

        {/* POI Counter Badge */}
        {nearbyPois.length > 0 && (
          <div className="poi-counter-badge">
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            <span>{nearbyPois.length} POI trovati</span>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ========== Map Container ========== */
        .map-container {
          position: relative;
          height: 500px;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* ========== Loading Overlay ========== */
        .map-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }

        .map-loading-content {
          text-align: center;
        }

        .map-loading-content p {
          margin-top: 16px;
          font-size: 15px;
          color: #2d3748;
          font-weight: 500;
        }

        /* ========== POI Counter Badge ========== */
        .poi-counter-badge {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 10px 20px;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
          animation: slideUp 0.3s ease-out;
        }

        .poi-counter-badge i {
          color: #667eea;
          font-size: 16px;
        }

        .poi-counter-badge span {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
        }

        /* ========== Marker Bounce Animation ========== */
        @keyframes :global(markerBounce) {
          0% {
            transform: translate(-50%, -100%) scale(0) translateY(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -100%) scale(1.2) translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100%) scale(1) translateY(0);
            opacity: 1;
          }
        }

        /* ========== Slide Up Animation ========== */
        @keyframes :global(slideUp) {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* ========== Pulse Animation (User Marker) ========== */
        @keyframes :global(pulse) {
          0% {
            box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(66, 133, 244, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
          }
        }

        /* ========== Responsive ========== */
        @media (max-width: 767px) {
          .map-container {
            height: 400px;
            border-radius: 8px;
          }

          .poi-counter-badge {
            bottom: 15px;
            padding: 8px 16px;
            font-size: 13px;
          }
        }

        @media (max-width: 575px) {
          .map-container {
            height: 350px;
            border-radius: 0;
          }

          .poi-counter-badge {
            bottom: 10px;
            padding: 6px 12px;
          }

          .poi-counter-badge span {
            font-size: 12px;
          }
        }

        /* ========== Map Styles ========== */
        .map-container :global(.gm-style) {
          border-radius: 12px;
        }

        @media (max-width: 575px) {
          .map-container :global(.gm-style) {
            border-radius: 0;
          }
        }
      `}</style>
    </>
  );
};

export default GMapCiviglioHome;
