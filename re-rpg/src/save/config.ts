/** Firebase web config from Vite env. Public by design; security lives in Firestore rules. */
export interface FirebaseConfig { apiKey: string; authDomain: string; projectId: string; appId: string; }

export function firebaseConfig(): FirebaseConfig | null {
  const env = import.meta.env as Record<string, string | undefined>;
  const apiKey = env.VITE_FIREBASE_API_KEY, authDomain = env.VITE_FIREBASE_AUTH_DOMAIN, projectId = env.VITE_FIREBASE_PROJECT_ID, appId = env.VITE_FIREBASE_APP_ID;
  if (!apiKey || !authDomain || !projectId || !appId) return null;
  return { apiKey, authDomain, projectId, appId };
}
