import React from 'react';
import { Spin } from 'antd';

const Loading = ({ align = 'center', cover = 'inline' }) => {
  const styles = {
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    page: {
      minHeight: '100vh'
    },
    inline: {
      padding: '20px'
    }
  };

  const containerStyle = {
    ...styles.center,
    ...(cover === 'page' ? styles.page : styles.inline)
  };

  return (
    <div style={containerStyle}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;
