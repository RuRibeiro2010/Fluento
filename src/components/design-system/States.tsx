import React from 'react';
import { Button } from './Button';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text,
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div
        className={`${sizes[size]} border-indigo-500 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-xs font-medium text-slate-400">{text}</p>}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-800/60 animate-pulse rounded-xl ${className}`} />
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionText, onAction, icon }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
    {icon && <div className="mb-4 text-indigo-400">{icon}</div>}
    <h4 className="text-base font-bold text-white mb-1">{title}</h4>
    <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
    {actionText && onAction && (
      <Button variant="primary" size="sm" onClick={onAction}>
        {actionText}
      </Button>
    )}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = 'Ocorreu um erro', message, onRetry }) => (
  <div className="p-5 bg-rose-950/40 border border-rose-900/60 rounded-2xl text-rose-200 text-xs flex flex-col gap-3">
    <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{title}</span>
    </div>
    <p className="text-slate-300 leading-relaxed">{message}</p>
    {onRetry && (
      <div className="pt-2">
        <Button variant="danger" size="sm" onClick={onRetry}>
          Tentar Novamente
        </Button>
      </div>
    )}
  </div>
);

export const SuccessState: React.FC<{
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, message, actionText, onAction }) => (
  <div className="p-6 bg-emerald-950/40 border border-emerald-900/60 rounded-2xl text-emerald-200 text-xs flex flex-col items-center text-center gap-3">
    <div className="w-12 h-12 rounded-full bg-emerald-900/80 border border-emerald-700 flex items-center justify-center text-emerald-400">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h4 className="text-base font-bold text-white">{title}</h4>
    <p className="text-slate-300 max-w-sm leading-relaxed">{message}</p>
    {actionText && onAction && (
      <div className="pt-2">
        <Button variant="success" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      </div>
    )}
  </div>
);
