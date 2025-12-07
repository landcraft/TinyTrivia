
declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

export const getEnv = (key: string): string => {
  // 1. Check runtime injected variables (Docker)
  if (window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }

  // 2. Check Vite build-time variables
  // Note: Vite uses import.meta.env, but we map process.env for compatibility in some setups.
  // We check import.meta.env if available, otherwise fallback.
  // @ts-ignore
  if (import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }

  // 3. Fallback to process.env (Standard Node/Webpack/Vite replacement)
  return process.env[key] || '';
};
