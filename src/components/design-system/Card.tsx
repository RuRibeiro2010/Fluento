import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'accent' | 'outlined';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseStyle = 'rounded-2xl p-5 border transition-all duration-200';

  const variants = {
    default: 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg',
    glass: 'bg-slate-900/70 backdrop-blur-md border-slate-800/80 text-slate-100 shadow-xl',
    accent: 'bg-gradient-to-br from-slate-900 to-indigo-950/40 border-indigo-900/50 text-slate-100 shadow-xl',
    outlined: 'bg-slate-950 border-slate-800 text-slate-100',
  };

  const hoverStyle = hoverable
    ? 'hover:border-indigo-500/50 hover:shadow-indigo-500/10 hover:shadow-xl cursor-pointer hover:-translate-y-0.5'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`flex flex-col gap-1 mb-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h3 className={`text-lg font-bold text-white tracking-tight ${className}`}>{children}</h3>;

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-xs text-slate-400 leading-relaxed ${className}`}>{children}</p>;

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`space-y-3 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mt-5 pt-4 border-t border-slate-800 flex items-center justify-between ${className}`}>{children}</div>;
