import React from 'react';
import HeaderNew from '../layoutpub-components/HeaderNew';
import Footer from '../layoutpub-components/Footer';

const AppLayoutSimple = ({ children }) => {
  return (
    <div id="wrapper" className="listeo">
      <HeaderNew />

      <div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ minHeight: '500px', padding: '104px 20px 20px 20px' }}>
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AppLayoutSimple;
