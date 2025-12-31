import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Tooltip } from 'antd';
import { API_KEY } from '../../constants/MapConstant';

const GoogleMapReact = dynamic(
  () => import('google-map-react'),
  { ssr: false }
);

const Marker = ({ lat, lng, text, linkedPointer }) => {
  const markerStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: '32px',
    cursor: 'pointer',
  };

  return (
    <div style={markerStyle}>
      <Tooltip title={text}>
        {!linkedPointer ? (
          <img src="/img/mapcn.png" alt="marker" width={32} />
        ) : (
          <img src="/img/mapcw.png" alt="linked marker" width={18} />
        )}
      </Tooltip>
    </div>
  );
};

const POIMap = ({ lat, lng, onMapClick, editable = true, title = '' }) => {
  const [center, setCenter] = useState({ lat: lat || 41.890321994610964, lng: lng || 12.492220169150155 });
  const [markerPos, setMarkerPos] = useState({ lat: lat || 41.890321994610964, lng: lng || 12.492220169150155 });

  useEffect(() => {
    if (lat && lng) {
      setCenter({ lat, lng });
      setMarkerPos({ lat, lng });
    }
  }, [lat, lng]);

  const handleMapClick = ({ lat, lng }) => {
    if (editable && onMapClick) {
      setMarkerPos({ lat, lng });
      onMapClick({ lat, lng });
    }
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: API_KEY,
          language: 'it',
          region: 'it'
        }}
        center={center}
        defaultZoom={15}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        }}
        yesIWantToUseGoogleMapApiInternals
      >
        <Marker
          lat={markerPos.lat}
          lng={markerPos.lng}
          text={title || 'POI Location'}
          linkedPointer={false}
        />
      </GoogleMapReact>
    </div>
  );
};

export default POIMap;
