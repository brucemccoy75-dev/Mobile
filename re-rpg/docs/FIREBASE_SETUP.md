# Firebase setup (cloud save + hosting)

The game is local-first. Without this setup it runs entirely on device storage. With it, progress follows the player across devices.

## 1. Create the project

1. [console.firebase.google.com](https://console.firebase.google.com) → Add project → name it (e.g. `re-rpg`). Analytics off is fine.
2. **Build → Authentication → Get started → Sign-in method**: enable **Anonymous** and **Google**.
3. **Build → Firestore Database → Create database** → production mode → pick a region near your players.
4. **Project settings → Your apps → Web app** (`</>`) → register `re-rpg` → copy the config values.

## 2. Local config

Create `re-rpg/.env` (git-ignored) from `.env.example`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project>
VITE_FIREBASE_APP_ID=...
```

Put `re-rpg-REPLACE_ME` → your project id in `.firebaserc`. `npm run dev` then boots with cloud save; the title shows `cloud: anonymous device` and a **Link Google account** button.

## 3. Rules and hosting

```sh
npm i -g firebase-tools
firebase login
cd re-rpg && npm run build
firebase deploy --only firestore:rules,hosting
```

`firestore.rules` lets a signed-in user read and write only `players/{their uid}`.

## 4. GitHub Actions deploy

In the repo: **Settings → Secrets and variables → Actions**.

- Variable `FIREBASE_PROJECT_ID` = your project id.
- Secret `FIREBASE_SERVICE_ACCOUNT` = the JSON of a service account with the *Firebase Hosting Admin* role (Project settings → Service accounts → Generate new private key).
- Secrets `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` so the build embeds the web config.

Pushes to `main` then deploy to Firebase Hosting. Add the Hosting domain to **Authentication → Settings → Authorized domains** so Google sign-in works there.

## How sync behaves

- First launch signs in anonymously; nothing is asked of the player.
- Every save goes to device storage first, then to Firestore a moment later. Offline play keeps saving locally and pushes when the cloud is back.
- On launch the device and cloud copies merge: discoveries union, counters max, the newer run wins.
- **Link Google account** upgrades the anonymous account. If that Google account already has progress on another device, the game signs into that account and merges both.
