import React, { useRef, useEffect, useState } from 'react';
import { Input } from 'antd';

/**
 * SearchBox Component - Top-tier design
 *
 * Features:
 * - Google Places Autocomplete integration
 * - Modern design with icon and clear button
 * - Smooth animations
 * - Responsive layout
 * - Loading states
 * - Error handling
 */
const SearchBox = ({ map, maps, onPlaceSelected, placeholder }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!map || !maps || !inputRef.current) return;

    // Crea Google Places Autocomplete
    try {
      const input = inputRef.current.input || inputRef.current;

      autocompleteRef.current = new maps.places.Autocomplete(input, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'it' }, // Limita a Italia
        fields: ['geometry', 'name', 'formatted_address', 'place_id']
      });

      // Listener per quando un luogo viene selezionato
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();

        if (!place.geometry) {
          console.warn('No geometry for place:', place.name);
          return;
        }

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name,
          address: place.formatted_address
        };

        // Centra la mappa sul luogo selezionato
        if (map) {
          map.setCenter(location);
          map.setZoom(15);
        }

        // Callback al componente padre
        if (onPlaceSelected) {
          onPlaceSelected(location);
        }

        setSearchValue(place.name || place.formatted_address || '');
      });

      // Cleanup
      return () => {
        if (listener) {
          maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [map, maps, onPlaceSelected]);

  const handleClear = () => {
    setSearchValue('');
    if (inputRef.current) {
      const input = inputRef.current.input || inputRef.current;
      input.value = '';
      input.focus();
    }
  };

  return (
    <>
      <div className={`search-box-container ${isFocused ? 'focused' : ''}`}>
        <div className="search-box-icon">
          <i className="fa fa-search" aria-hidden="true"></i>
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || 'Cerca un indirizzo o luogo...'}
          className="search-box-input"
        />
        {searchValue && (
          <button
            className="search-box-clear"
            onClick={handleClear}
            aria-label="Cancella ricerca"
          >
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        )}
      </div>

      <style jsx>{`
        /* ========== Search Box Container ========== */
        .search-box-container {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          max-width: 400px;
          z-index: 10;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          padding: 0 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-box-container.focused {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
          transform: translateY(-2px);
        }

        /* ========== Search Icon ========== */
        .search-box-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          font-size: 16px;
          margin-right: 8px;
          transition: color 0.3s ease;
        }

        .search-box-container.focused .search-box-icon {
          color: #667eea;
        }

        /* ========== Input Field ========== */
        :global(.search-box-input) {
          flex: 1;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          font-size: 15px;
          color: #2d3748;
          background: transparent !important;
          padding: 12px 0 !important;
        }

        :global(.search-box-input::placeholder) {
          color: #a0aec0;
          font-size: 14px;
        }

        :global(.search-box-input:focus) {
          border: none !important;
          box-shadow: none !important;
        }

        /* ========== Clear Button ========== */
        .search-box-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #a0aec0;
          font-size: 14px;
          border-radius: 50%;
          transition: all 0.2s ease;
          margin-left: 8px;
        }

        .search-box-clear:hover {
          background: #f7fafc;
          color: #2d3748;
        }

        .search-box-clear:active {
          transform: scale(0.95);
        }

        /* ========== Google Autocomplete Dropdown Styling ========== */
        :global(.pac-container) {
          border-radius: 8px;
          margin-top: 4px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          border: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 1051 !important;
        }

        :global(.pac-container:after) {
          display: none;
        }

        :global(.pac-item) {
          padding: 12px 16px;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 14px;
          line-height: 1.5;
        }

        :global(.pac-item:hover) {
          background: #f7fafc;
        }

        :global(.pac-item-selected) {
          background: #edf2f7;
        }

        :global(.pac-icon) {
          margin-right: 12px;
          margin-top: 3px;
        }

        :global(.pac-item-query) {
          font-size: 15px;
          color: #2d3748;
          font-weight: 500;
        }

        :global(.pac-matched) {
          color: #667eea;
          font-weight: 600;
        }

        /* ========== Responsive ========== */
        @media (max-width: 767px) {
          .search-box-container {
            top: 15px;
            left: 15px;
            right: 15px;
            max-width: none;
          }

          :global(.search-box-input) {
            font-size: 14px;
          }

          :global(.search-box-input::placeholder) {
            font-size: 13px;
          }
        }

        @media (max-width: 575px) {
          .search-box-container {
            top: 10px;
            left: 10px;
            right: 10px;
            padding: 0 10px;
          }

          .search-box-icon {
            font-size: 14px;
          }

          :global(.search-box-input) {
            font-size: 13px;
            padding: 10px 0 !important;
          }

          :global(.pac-item) {
            padding: 10px 12px;
            font-size: 13px;
          }
        }

        /* ========== Loading State (Optional Enhancement) ========== */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .search-box-container.loading .search-box-icon {
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* ========== Accessibility ========== */
        .search-box-clear:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        :global(.search-box-input:focus) {
          outline: none !important;
        }

        /* Focus visible for keyboard navigation */
        .search-box-container:focus-within {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </>
  );
};

export default SearchBox;
