import React from 'react';

export const LoadingOverlay: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex h-full items-center justify-center p-10 text-slate-600">
    <span className="animate-pulse text-sm font-medium">{label}</span>
  </div>
);
