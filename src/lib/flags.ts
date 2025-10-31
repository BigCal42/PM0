/**
 * Feature flags for PM0 Playground mode
 * Controlled via environment variables, default off in production
 */

/**
 * Check if PM0 Playground mode is enabled
 * Set VITE_PM0_PLAYGROUND=1 to enable new UX surfaces
 */
export function isPlaygroundEnabled(): boolean {
  const value = import.meta.env.VITE_PM0_PLAYGROUND;
  return value === '1' || value === 'true';
}

/**
 * Check if AI guidance features are enabled
 * Set VITE_USE_AI_GUIDANCE=1 to enable AI-powered insights
 */
export function isAiGuidanceEnabled(): boolean {
  const value = import.meta.env.VITE_USE_AI_GUIDANCE;
  return value === '1' || value === 'true';
}
