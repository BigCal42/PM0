import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toast notification provider
 * Wraps Sonner toaster with PM0 branding
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={true}
      richColors
      closeButton
    />
  );
}

