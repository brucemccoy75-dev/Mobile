export const APP_VERSION = '0.0.1';

declare const __BUILD__: string;
/** The commit this build came from (vite.config.ts), shown on the title screen. */
export const BUILD = typeof __BUILD__ === 'string' ? __BUILD__ : 'dev';
