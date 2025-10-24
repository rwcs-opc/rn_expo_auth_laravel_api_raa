# Authentication Setup Guide

## Current Setup (Expo Go - Mock Auth)

The app is currently using **mock authentication** (`AuthContextMock.tsx`) to work with Expo Go for testing the UI and flow.

### Mock Auth Features:
- ✅ Phone number input and OTP verification (accepts any 6-digit code)
- ✅ User registration with all fields
- ✅ Data persistence using AsyncStorage
- ✅ Full navigation flow working
- ✅ Dashboard with logout

### Testing with Mock Auth:
1. Run: `npm run android` or `npx expo start`
2. Enter any phone number (e.g., 9876543210)
3. Click "Send OTP"
4. Enter any 6-digit code (e.g., 123456)
5. Complete registration form
6. View dashboard

---

## Production Setup (Firebase - Real Auth)

To use **real Firebase authentication**, you need to build a development build (not Expo Go).

### Steps to Switch to Firebase:

#### 1. Build Development Build
```bash
# Install EAS CLI globally (if not installed)
npm install -g eas-cli

# Login to Expo account
eas login

# Build for Android
eas build --platform android --profile development

# Or build for iOS
eas build --platform ios --profile development
```

#### 2. Install the Development Build
- Download and install the APK/IPA from the EAS build
- Or scan QR code from EAS build page

#### 3. Switch to Real Firebase Auth

Update these files to use `AuthContext` instead of `AuthContextMock`:

**app/_layout.tsx:**
```typescript
// Change this line:
import { AuthProvider, useAuth } from '@/contexts/AuthContextMock';

// To this:
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
```

**app/login.tsx:**
```typescript
// Change:
import { useAuth } from '@/contexts/AuthContextMock';

// To:
import { useAuth } from '@/contexts/AuthContext';
```

**app/register.tsx:**
```typescript
// Change:
import { useAuth } from '@/contexts/AuthContextMock';

// To:
import { useAuth } from '@/contexts/AuthContext';
```

**app/dashboard.tsx:**
```typescript
// Change:
import { useAuth } from '@/contexts/AuthContextMock';

// To:
import { useAuth } from '@/contexts/AuthContext';
```

#### 4. Rebuild and Test
```bash
npx expo start --dev-client
```

---

## Firebase Configuration

Your Firebase is already configured with:
- ✅ `google-services.json` in place
- ✅ Firebase plugins in `app.json`
- ✅ Firebase packages installed:
  - `@react-native-firebase/app`
  - `@react-native-firebase/auth`
  - `@react-native-firebase/firestore`

### Firebase Console Setup Required:
1. Enable **Phone Authentication** in Firebase Console
2. Add your app's SHA-1 fingerprint (from EAS credentials)
3. Enable **Cloud Firestore** database
4. Set up Firestore security rules

---

## File Structure

```
contexts/
  ├── AuthContext.tsx          # Real Firebase auth (for production)
  └── AuthContextMock.tsx      # Mock auth (for Expo Go testing)

app/
  ├── _layout.tsx              # Root layout with auth routing
  ├── login.tsx                # Phone + OTP login screen
  ├── register.tsx             # User registration form
  ├── dashboard.tsx            # User dashboard
  └── (tabs)/
      └── index.tsx            # Home screen with carousel
```

---

## Troubleshooting

### "Native module RNFBAppModule not found"
- This means you're using Expo Go which doesn't support Firebase native modules
- Solution: Build a development build with EAS

### "expo-location not found"
- Run: `npm install expo-location`
- Run: `npx expo prebuild` (if using development build)

### OTP not received (Mock Auth)
- Mock auth accepts ANY 6-digit code
- No real SMS is sent

### OTP not received (Real Firebase)
- Check Firebase Console > Authentication > Phone
- Verify phone number format (+91XXXXXXXXXX)
- Check Firebase quota limits
- Add test phone numbers in Firebase Console for testing

---

## Quick Commands

```bash
# Start with Expo Go (Mock Auth)
npm run android

# Build development build
eas build --platform android --profile development

# Start with development build
npx expo start --dev-client

# Prebuild native code
npx expo prebuild

# Clear cache and restart
npx expo start --clear
```
