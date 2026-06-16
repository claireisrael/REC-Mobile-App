# REC Mobile

Expo (React Native) client for the **same** Renewable Energy Conference & Expo app as `rec-registration/`. Same data, same APIs, same copy — native shell only.

## Expo Go compatibility

This project uses **Expo SDK 54**, which works with **Expo Go from the Play Store / App Store**.

## Live data (default)

By default the app loads the same live content as the public website:

| Data | Source |
|------|--------|
| Conference + program + sessions | `GET https://rec.nrep.ug/api/program/public` |
| Sponsors | Appwrite (same keys as web) |
| Registration | `POST https://rec.nrep.ug/api/registration/*` |

Copy Appwrite keys from `rec-registration/.env` into `.env` (rename `NEXT_PUBLIC_*` → `EXPO_PUBLIC_*`).

## Preview mode (optional)

Set `EXPO_PUBLIC_OFFLINE_MODE=true` only when developing UI without network access. This uses bundled demo content and does **not** represent production data.

## Setup

```bash
cp .env.example .env
# Fill EXPO_PUBLIC_APPWRITE_* from rec-registration/.env

npm install
npm start
```

## Project structure

```
app/           Expo Router screens (tabs + session detail + about)
components/    UI and feature components (mirror web components)
context/       Shared conference/program data
lib/           API clients and utilities (ported from web)
data/          Static preview content only (EXPO_PUBLIC_OFFLINE_MODE)
```

## CI/CD — Android APK builds

GitHub Actions compiles APKs on every push to `main`/`master`, on pull requests (debug APK), and when you push a version tag (`v*`).

### Workflow

| Trigger | APK |
|---------|-----|
| Pull request | `debug` (fast, for CI verification) |
| Push to `main` / `master` | `release` |
| Tag `v1.0.0` | `release` + attached to GitHub Release |
| Manual dispatch | Choose `debug` or `release` |

Artifacts are uploaded from the **Actions** tab for 30 days.

### Required GitHub secrets

Add these under **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
|--------|---------|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API (sponsor fallback) |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | Appwrite database |
| `EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID` | Collections (copy from `rec-registration/.env`) |
| `EXPO_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID` | |
| `EXPO_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID` | |
| `EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID` | |
| `EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID` | |
| `EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID` | |

### Optional release signing secrets

Without these, release APKs use Expo’s default debug keystore (fine for internal testing). For production distribution, add:

| Secret | Purpose |
|--------|---------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded `.jks` / `.keystore` file |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password (defaults to keystore password) |

Generate base64 on Windows PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore"))
```

### Local APK build (same steps as CI)

```bash
cp .env.example .env
# fill EXPO_PUBLIC_* values

npm install
npm run build:android:apk:debug   # debug APK
npm run build:android:apk         # release APK
```

Output: `android/app/build/outputs/apk/*/app-*.apk`

### EAS Build (optional)

`eas.json` is included if you prefer Expo Application Services instead of Gradle on GitHub runners:

```bash
npx eas login
npx eas build:configure
npx eas build --platform android --profile preview
```
