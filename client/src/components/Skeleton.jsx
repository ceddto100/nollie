import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div className={`animate-pulse bg-gray-800/60 rounded ${className}`} {...props} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md overflow-hidden border border-gray-800">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-20 mt-4" />
      </div>
    </div>
  );
};

export const CardSkeletonGrid = ({ count = 3 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
