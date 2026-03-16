import React from 'react';
import NetworkBackground from './NetworkBackground';

const PageLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black">
      <NetworkBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
