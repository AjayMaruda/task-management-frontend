import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { BaseButton } from '../components/base/BaseButton';

interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
}

export const RouteErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError | string | null;
  const navigate = useNavigate();

  const errorMessage =
    error?.statusText ||
    error?.message ||
    (typeof error === 'string' ? error : 'An unexpected error occurred in the application.');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-5 shadow-lg shadow-rose-500/10">
          <i className="pi pi-exclamation-triangle text-rose-400 text-2xl"></i>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          We encountered an unexpected error while rendering this page or component.
        </p>

        {/* Error Details Box */}
        <div className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl p-3.5 mb-6 text-left overflow-x-auto max-h-36">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-rose-400 mb-1">
            Error Details
          </span>
          <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words m-0">
            {errorMessage}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <BaseButton
            type="button"
            variant="ghost"
            size="md"
            leftIcon="pi pi-refresh"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Reload Page
          </BaseButton>
          <BaseButton
            type="button"
            variant="primary"
            size="md"
            leftIcon="pi pi-home"
            onClick={() => {
              navigate('/dashboard', { replace: true });
            }}
            className="flex-1"
          >
            Dashboard
          </BaseButton>
        </div>
      </div>
    </div>
  );
};
