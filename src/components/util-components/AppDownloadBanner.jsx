import { useState, useEffect } from 'react';
import { Button, Space, Image } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const getQueryParam = (param) => {
  if (typeof window === 'undefined') return null;

  const hashIndex = window.location.href.indexOf('?');
  if (hashIndex === -1) return null;

  const queryParams = new URLSearchParams(window.location.href.slice(hashIndex));
  return queryParams.get(param);
};

const detectMobileOS = () => {
  if (typeof window === 'undefined') return { isAndroid: false, isIOS: false };

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

  return { isAndroid, isIOS };
};

const AppDownloadBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOS, setMobileOS] = useState({ isAndroid: false, isIOS: false });

  useEffect(() => {
    const { isAndroid, isIOS } = detectMobileOS();
    setMobileOS({ isAndroid, isIOS });

    const hasClosedBanner = localStorage.getItem('hasClosedBanner');
    const isMobileParam = getQueryParam('mobile') === 'true';

    console.log('isAndroid:', isAndroid);
    console.log('isIOS:', isIOS);
    console.log('hasClosedBanner:', hasClosedBanner);
    console.log('mobile param:', isMobileParam);

    if ((isAndroid || isIOS) && hasClosedBanner !== 'true' && !isMobileParam) {
      const timer = setTimeout(() => {
        console.log('Mostrando banner...');
        setIsVisible(true);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasClosedBanner', 'true');
    setIsVisible(false);
  };

  const handleDownload = (store) => {
    if (store === 'google') {
      window.open(
        'https://play.google.com/store/apps/details?id=it.guides4you.civiglio&hl=it',
        '_blank'
      );
    } else if (store === 'apple') {
      window.open(
        'https://apps.apple.com/it/app/civiglio/id6502668019',
        '_blank'
      );
    }
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f0f2f5',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/img/civiglio/logo.png"
          alt="App Logo"
          width={40}
          height={40}
          style={{ marginRight: '17px' }}
          preview={false}
        />
        <span style={{ fontSize: '12px', textAlign: 'center' }}>
          Per una migliore esperienza!
        </span>
      </div>
      <Space>
        <Button type="primary" onClick={() => handleDownload(mobileOS.isAndroid ? 'google' : 'apple')}>
          {mobileOS.isAndroid ? 'Scarica su Google Play' : 'Scarica su App Store'}
        </Button>
        <Button icon={<CloseOutlined />} onClick={handleClose} />
      </Space>
    </div>
  );
};

export default AppDownloadBanner;
