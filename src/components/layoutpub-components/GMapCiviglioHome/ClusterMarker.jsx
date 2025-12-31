import React from 'react';

/**
 * ClusterMarker - Marker per gruppi di POI vicini
 *
 * Visualizza un marker con il numero di POI contenuti nel cluster
 * Al click, esegue zoom-in per espandere il cluster
 */
const ClusterMarker = ({ lat, lng, points = [], onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick({ lat, lng });
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: 10
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Cerchio esterno (sfondo gradient) */}
        <div
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
        />

        {/* Cerchio interno (bianco) */}
        <div
          style={{
            position: 'absolute',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          {/* Numero POI */}
          <span
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#667eea',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            {points.length}
          </span>
        </div>

        {/* Icona pin piccola (top-right) */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '16px',
            height: '16px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 2
          }}
        >
          <img
            src="/img/civiglio/pinrol.png"
            alt="POI"
            width="10"
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClusterMarker;
