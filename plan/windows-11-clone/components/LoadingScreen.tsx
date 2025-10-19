
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center text-white">
      <svg className="w-20 h-20 text-blue-500" fill="currentColor" viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.085 0H0v43.085h43.085V0zM92 0H48.915v43.085H92V0zM43.085 48.915H0V92h43.085V48.915zM92 48.915H48.915V92H92V48.915z"/>
      </svg>
      <div className="mt-8 flex items-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>Starting up...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
