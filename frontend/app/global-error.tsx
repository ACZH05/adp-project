"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-lg border border-border-muted bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold text-primary">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              The app hit an unexpected error. Try again to reload the current
              screen.
            </p>
            {error.digest ? (
              <p className="mt-3 font-mono text-xs text-text-muted">
                Error ID: {error.digest}
              </p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-default bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-container"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
