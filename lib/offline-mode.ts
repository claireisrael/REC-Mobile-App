/**
 * Preview mode uses bundled static content for UI-only development.
 * By default the app loads the same live data as the web app (rec.nrep.ug).
 */
export function isPreviewMode() {
  return process.env.EXPO_PUBLIC_OFFLINE_MODE === 'true';
}

/** @deprecated Use isPreviewMode — kept for existing imports */
export function isOfflineMode() {
  return isPreviewMode();
}
