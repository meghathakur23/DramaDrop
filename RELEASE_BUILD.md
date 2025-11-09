# Release Build Guide for DramaDrop

This guide explains how to build release versions of the DramaDrop app for Android and iOS.

## Android Release Build

### Prerequisites
- Android SDK installed
- Java Development Kit (JDK) installed
- Keystore file for signing (required for release builds)

### Step 1: Generate a Keystore (First Time Only)

If you don't have a keystore, create one:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore dramadrop-release.keystore -alias dramadrop-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Save the keystore password and key password securely. You'll need them later.

### Step 2: Configure Gradle for Release Signing

1. Create `android/gradle.properties` (if it doesn't exist) or add these lines:

```properties
DRAMADROP_RELEASE_STORE_FILE=dramadrop-release.keystore
DRAMADROP_RELEASE_KEY_ALIAS=dramadrop-key-alias
DRAMADROP_RELEASE_STORE_PASSWORD=your_store_password
DRAMADROP_RELEASE_KEY_PASSWORD=your_key_password
```

2. Update `android/app/build.gradle` to add release signing config:

```gradle
android {
    ...
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('DRAMADROP_RELEASE_STORE_FILE')) {
                storeFile file(DRAMADROP_RELEASE_STORE_FILE)
                storePassword DRAMADROP_RELEASE_STORE_PASSWORD
                keyAlias DRAMADROP_RELEASE_KEY_ALIAS
                keyPassword DRAMADROP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Step 3: Build Release APK

**Option A: Using Gradle directly**

```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

**Option B: Using React Native CLI**

```bash
npm run android -- --mode=release
```

### Step 4: Build Release AAB (Android App Bundle) for Google Play

For Google Play Store, you need an AAB file instead of APK:

```bash
cd android
./gradlew bundleRelease
```

The AAB will be generated at: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 5: Verify the Build

You can verify the APK/AAB is signed correctly:

```bash
# For APK
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk

# For AAB
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

---

## iOS Release Build

### Prerequisites
- macOS with Xcode installed
- Apple Developer Account
- Code signing certificates configured in Xcode

### Step 1: Configure Xcode Project

1. Open the iOS project in Xcode:
```bash
cd ios
open DramaDropApp.xcworkspace
```

2. Select your project in the navigator
3. Go to "Signing & Capabilities" tab
4. Select your Team
5. Ensure "Automatically manage signing" is checked (or configure manually)

### Step 2: Update Version and Build Number

In Xcode:
- Select your project
- Go to "General" tab
- Update "Version" (e.g., 1.0.0)
- Update "Build" number (e.g., 1)

Or edit `ios/DramaDropApp/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### Step 3: Build Release IPA

**Option A: Using Xcode (Recommended)**

1. Open `ios/DramaDropApp.xcworkspace` in Xcode
2. Select "Any iOS Device" or your connected device
3. Product → Archive
4. Wait for the archive to complete
5. In the Organizer window:
   - Click "Distribute App"
   - Choose distribution method (App Store, Ad Hoc, Enterprise, or Development)
   - Follow the wizard to create the IPA

**Option B: Using Command Line**

```bash
cd ios
xcodebuild -workspace DramaDropApp.xcworkspace \
           -scheme DramaDropApp \
           -configuration Release \
           -archivePath build/DramaDropApp.xcarchive \
           archive

# Create IPA
xcodebuild -exportArchive \
           -archivePath build/DramaDropApp.xcarchive \
           -exportPath build \
           -exportOptionsPlist ExportOptions.plist
```

### Step 4: Create ExportOptions.plist

Create `ios/ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string> <!-- or "ad-hoc", "enterprise", "development" -->
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
```

---

## Quick Commands Summary

### Android
```bash
# Build APK
cd android && ./gradlew assembleRelease

# Build AAB
cd android && ./gradlew bundleRelease

# Clean build
cd android && ./gradlew clean assembleRelease
```

### iOS
```bash
# Build for device
npm run ios -- --configuration Release

# Archive in Xcode
# Product → Archive
```

---

## Troubleshooting

### Android
- **Build fails**: Check if keystore path and passwords are correct
- **APK not signed**: Ensure signingConfig is set in build.gradle
- **Large APK size**: Enable ProGuard minification

### iOS
- **Code signing errors**: Check certificates in Xcode
- **Archive fails**: Clean build folder (Product → Clean Build Folder)
- **Provisioning profile issues**: Update profiles in Xcode

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit keystore files or passwords to Git
- Add `*.keystore` to `.gitignore`
- Store keystore passwords securely (use environment variables or secure vaults)
- Keep backup of your keystore file in a secure location

---

## Next Steps

After building:
1. **Android**: Upload AAB to Google Play Console
2. **iOS**: Upload IPA to App Store Connect via Xcode or Transporter
3. Test the release build thoroughly before publishing

