import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ 
  children, 
  className = '', 
  title 
}) => {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-lg font-semibold text-emerald-400">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};