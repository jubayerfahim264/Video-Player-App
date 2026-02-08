# AdMob & Privacy Policy Setup

## AdMob

### Installation

Dependencies are in `package.json`. Run:

```bash
npm install
```

Then rebuild the app:

```bash
npx react-native run-android
```

### Configuration

1. **App ID (required)**  
   Get your Android App ID from [AdMob](https://apps.admob.com) → Apps → App settings.

   - **Android**: Update `app.json` → `react-native-google-mobile-ads` → `android_app_id`.
   - **Android**: Update `android/app/src/main/AndroidManifest.xml` → `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="YOUR_APP_ID"/>`.

   The project currently uses **test App IDs** so the app runs without an AdMob account. Replace with your real App ID before release.

2. **Ad Unit IDs (for production)**  
   In `src/config/adMob.ts`, replace the placeholder production IDs with your real Ad Unit IDs from AdMob → Ad units:

   - `BANNER` – bottom banner
   - `INTERSTITIAL` – full-screen (after user action)
   - `REWARDED` – optional rewarded ads

   In development, test IDs are used automatically (`__DEV__`).

### Policy

- In Google Play Console, set **App content** → **Ads** → “Yes, my app contains ads”.
- Do not use production Ad Unit IDs in development to avoid policy issues.

---

## Privacy Policy

- **Screen**: `src/screens/PrivacyPolicyScreen.tsx` (in-app).
- **Languages**: English (default), Bengali. Language is chosen from device settings via `react-native-localize`.
- **Content**: Mentions AdMob, storage permission, internet permission, and that no personal data is collected (Play Store safe).
- **Access**: From the main screen header, tap “Privacy Policy” to open; use “Back” to return.

### Adding more languages

1. Add a new JSON file under `src/i18n/locales/` (e.g. `hi.json`).
2. In `src/i18n/index.ts`, import it and add the locale to `translations` and `SUPPORTED_LOCALES`.
