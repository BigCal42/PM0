import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toast notification provider
 * Wraps Sonner toaster with PM0 dark mode branding
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          color: '#e5e5e5',
        },
      }}
    />
  );
}

