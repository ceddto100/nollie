import React from 'react';
import NetworkBackground from './NetworkBackground';

const PageLayout = ({ children }) => {
  return (
    <div className="fixed inset-0 w-screen overflow-y-auto bg-black">
      <div className="relative min-h-screen pt-16">
        <NetworkBackground />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
