'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Something went wrong!</h1>
        <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} data-testid="error-reset-button">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'} data-testid="error-home-button">
            Go Home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-lg max-w-2xl mx-auto text-left">
            <p className="text-sm text-red-400 font-mono">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
