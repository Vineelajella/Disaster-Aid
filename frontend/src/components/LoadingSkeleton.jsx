import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-dark-card rounded-lg p-6 shadow-lg animate-pulse">
          <div className="h-6 bg-dark-border rounded mb-4"></div>
          <div className="h-4 bg-dark-border rounded mb-2"></div>
          <div className="h-4 bg-dark-border rounded w-3/4 mb-4"></div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 bg-dark-border rounded-full w-16"></div>
            <div className="h-6 bg-dark-border rounded-full w-20"></div>
          </div>
          <div className="h-4 bg-dark-border rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-dark-border rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;