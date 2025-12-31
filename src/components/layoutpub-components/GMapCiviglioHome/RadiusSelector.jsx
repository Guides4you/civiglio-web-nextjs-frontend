import React, { useState } from 'react';
import { Slider, Tooltip } from 'antd';

/**
 * RadiusSelector Component - Top-tier design
 *
 * Features:
 * - Slider for radius selection (1km - 50km)
 * - Visual feedback with icon
 * - Smooth animations
 * - Responsive design
 * - Tooltip with current value
 */
const RadiusSelector = ({ value = 5000, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const radiusOptions = [
    { value: 1000, label: '1km' },
    { value: 2000, label: '2km' },
    { value: 5000, label: '5km' },
    { value: 10000, label: '10km' },
    { value: 20000, label: '20km' },
    { value: 50000, label: '50km' }
  ];

  const getCurrentLabel = () => {
    const option = radiusOptions.find(opt => opt.value === value);
    return option ? option.label : `${(value / 1000).toFixed(0)}km`;
  };

  const handleChange = (newValue) => {
    onChange && onChange(newValue);
  };

  return (
    <>
      <div className={`radius-selector ${isExpanded ? 'expanded' : ''}`}>
        <Tooltip title="Raggio di ricerca" placement="left">
          <button
            className="radius-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Selettore raggio ricerca"
          >
            <i className="fa fa-crosshairs" aria-hidden="true"></i>
            <span className="radius-value">{getCurrentLabel()}</span>
          </button>
        </Tooltip>

        {isExpanded && (
          <div className="radius-slider-container">
            <div className="radius-slider-header">
              <span>Raggio di ricerca</span>
              <span className="radius-current">{getCurrentLabel()}</span>
            </div>

            <Slider
              min={1000}
              max={50000}
              step={1000}
              value={value}
              onChange={handleChange}
              marks={{
                1000: '1km',
                5000: '5km',
                10000: '10km',
                20000: '20km',
                50000: '50km'
              }}
              tooltip={{
                formatter: (val) => `${(val / 1000).toFixed(0)}km`
              }}
            />

            <div className="radius-quick-select">
              {radiusOptions.map((option) => (
                <button
                  key={option.value}
                  className={`quick-btn ${value === option.value ? 'active' : ''}`}
                  onClick={() => handleChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ========== Radius Selector Container ========== */
        .radius-selector {
          position: absolute;
          top: 80px;
          right: 20px;
          z-index: 10;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ========== Toggle Button ========== */
        .radius-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: none;
          border-radius: 24px;
          padding: 10px 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          color: #2d3748;
        }

        .radius-toggle:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
          transform: translateY(-2px);
        }

        .radius-toggle:active {
          transform: translateY(0);
        }

        .radius-toggle i {
          color: #667eea;
          font-size: 16px;
        }

        .radius-value {
          font-weight: 600;
          color: #667eea;
        }

        /* ========== Expanded Slider Container ========== */
        .radius-slider-container {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          min-width: 280px;
          animation: slideDown 0.3s ease-out;
        }

        .radius-slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .radius-slider-header span:first-child {
          color: #4a5568;
          font-weight: 500;
        }

        .radius-current {
          color: #667eea;
          font-weight: 700;
          font-size: 16px;
        }

        /* ========== Slider Styling ========== */
        .radius-selector :global(.ant-slider) {
          margin: 16px 0 24px 0;
        }

        .radius-selector :global(.ant-slider-rail) {
          background: #e2e8f0;
        }

        .radius-selector :global(.ant-slider-track) {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .radius-selector :global(.ant-slider-handle) {
          border-color: #667eea;
          background: white;
        }

        .radius-selector :global(.ant-slider-handle:hover),
        .radius-selector :global(.ant-slider-handle:focus) {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        .radius-selector :global(.ant-slider-mark-text) {
          font-size: 11px;
          color: #a0aec0;
        }

        .radius-selector :global(.ant-slider-mark-text-active) {
          color: #667eea;
          font-weight: 600;
        }

        /* ========== Quick Select Buttons ========== */
        .radius-quick-select {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-btn {
          flex: 1;
          min-width: 60px;
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
        }

        .quick-btn:hover {
          border-color: #667eea;
          color: #667eea;
          background: #f7fafc;
        }

        .quick-btn.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }

        /* ========== Animations ========== */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========== Responsive ========== */
        @media (max-width: 767px) {
          .radius-selector {
            top: 70px;
            right: 15px;
          }

          .radius-slider-container {
            min-width: 260px;
            padding: 16px;
          }

          .quick-btn {
            min-width: 50px;
            font-size: 12px;
          }
        }

        @media (max-width: 575px) {
          .radius-selector {
            top: 60px;
            right: 10px;
          }

          .radius-toggle {
            padding: 8px 12px;
            font-size: 13px;
          }

          .radius-slider-container {
            right: -10px;
            min-width: calc(100vw - 20px);
            max-width: 300px;
          }

          .quick-btn {
            min-width: 45px;
            padding: 5px 8px;
            font-size: 11px;
          }
        }

        /* ========== Accessibility ========== */
        .radius-toggle:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        .quick-btn:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default RadiusSelector;
