import React from 'react';

export const Heading1: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h1 className={`text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight ${className}`}>{children}</h1>
);

export const Heading2: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight ${className}`}>{children}</h2>
);

export const Heading3: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-slate-100 tracking-tight ${className}`}>{children}</h3>
);

export const Subtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-base text-slate-300 font-medium leading-relaxed ${className}`}>{children}</p>
);

export const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-300 leading-relaxed ${className}`}>{children}</p>
);

export const CaptionText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`text-xs text-slate-400 font-medium ${className}`}>{children}</span>
);
