// Firebase adapter: anonymous auth on first launch, "link Google" to keep
// progress across devices, one Firestore document per uid. The SDK is loaded
// lazily so players without a configured backend never download it.
import type { Cloud, CloudDoc } from './SyncedSaveStore';
import type { FirebaseConfig } from './config';

export interface CloudAccount {
  uid: string;
  anonymous: boolean;
  displayName: string | null;
}

export interface FirebaseCloud<Meta, Run> extends Cloud<Meta, Run> {
  account(): CloudAccount | null;
  onAccountChange(cb: (a: CloudAccount | null) => void): void;
  /** Upgrade the anonymous account to Google. Resolves to the account now signed in. */
  linkGoogle(): Promise<CloudAccount>;
}

export async function createFirebaseCloud<Meta, Run>(config: FirebaseConfig): Promise<FirebaseCloud<Meta, Run>> {
  const [{ initializeApp }, auth, fs] = await Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')]);
  const app = initializeApp(config);
  const a = auth.getAuth(app);
  const db = fs.getFirestore(app);
  const listeners: ((x: CloudAccount | null) => void)[] = [];

  const toAccount = (u: { uid: string; isAnonymous: boolean; displayName: string | null } | null): CloudAccount | null =>
    u ? { uid: u.uid, anonymous: u.isAnonymous, displayName: u.displayName } : null;

  let current: CloudAccount | null = null;
  auth.onAuthStateChanged(a, (u) => { current = toAccount(u); for (const l of listeners) l(current); });

  // Wait for the first auth state; sign in anonymously if nobody is there.
  await new Promise<void>((resolve) => {
    const off = auth.onAuthStateChanged(a, (u) => { off(); if (u) resolve(); else auth.signInAnonymously(a).then(() => resolve(), () => resolve()); });
  });

  const ref = () => {
    const u = a.currentUser;
    if (!u) throw new Error('Not signed in');
    return fs.doc(db, 'players', u.uid);
  };

  return {
    async load() {
      const snap = await fs.getDoc(ref());
      return snap.exists() ? (snap.data() as CloudDoc<Meta, Run>) : null;
    },
    async save(doc) {
      await fs.setDoc(ref(), doc);
    },
    account: () => current,
    onAccountChange: (cb) => { listeners.push(cb); },
    async linkGoogle() {
      const provider = new auth.GoogleAuthProvider();
      const u = a.currentUser;
      if (!u) throw new Error('Not signed in');
      try {
        const res = await auth.linkWithPopup(u, provider);
        return toAccount(res.user)!;
      } catch (e) {
        // The Google account already owns a player: sign into it instead. The
        // SyncedSaveStore merges the two metas on the next pull.
        const code = (e as { code?: string }).code;
        if (code === 'auth/credential-already-in-use' || code === 'auth/email-already-in-use') {
          const res = await auth.signInWithPopup(a, provider);
          return toAccount(res.user)!;
        }
        throw e;
      }
    },
  };
}
