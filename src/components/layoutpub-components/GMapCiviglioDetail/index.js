import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { API_KEY } from '../../../constants/MapConstant';

// Import dinamico di google-map-react per SSR
const GoogleMapReact = dynamic(
  () => import('google-map-react'),
  { ssr: false }
);

const Marker = () => (
  <div style={{
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
  }}>
    <img
      src="/img/civiglio/pinrol.png"
      alt="POI Marker"
      width={32}
      style={{ cursor: 'pointer' }}
    />
  </div>
);

const GMapCiviglioDetail = ({ poi }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  if (!poi || !poi.geoJson) {
    return (
      <div style={{
        height: '400px',
        background: '#e9ecef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#6c757d' }}>
          Coordinate non disponibili
        </p>
      </div>
    );
  }

  let coordinates;
  try {
    const geoJson = JSON.parse(poi.geoJson);
    coordinates = {
      lat: geoJson.coordinates[1],
      lng: geoJson.coordinates[0]
    };
  } catch (e) {
    console.error('Error parsing geoJson:', e);
    return null;
  }

  const defaultProps = {
    center: coordinates,
    zoom: 15
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: API_KEY,
          language: 'it',
          region: 'it'
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        }}
        onGoogleApiLoaded={() => setMapLoaded(true)}
        yesIWantToUseGoogleMapApiInternals
      >
        <Marker lat={coordinates.lat} lng={coordinates.lng} />
      </GoogleMapReact>
    </div>
  );
};

export default GMapCiviglioDetail;
