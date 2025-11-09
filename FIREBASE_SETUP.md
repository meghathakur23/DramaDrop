# Firebase Setup Guide for DramaDrop

This guide will walk you through setting up Firebase Storage for video hosting in the DramaDrop app.

## Prerequisites

- A Firebase account (create one at [firebase.google.com](https://firebase.google.com))
- Node.js and npm installed
- React Native development environment set up

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter project name (e.g., "DramaDrop")
4. Follow the setup wizard:
   - Enable/disable Google Analytics (optional)
   - Choose or create a Google Analytics account
5. Click "Create project"

## Step 2: Add Android App to Firebase

1. In Firebase Console, click the Android icon (or "Add app")
2. Enter package name: `com.dramadropapp`
3. Enter app nickname (optional): "DramaDrop Android"
4. Enter debug signing certificate SHA-1 (optional, for now)
5. Click "Register app"
6. Download `google-services.json`
7. Place the file at: `android/app/google-services.json`

## Step 3: Add iOS App to Firebase

1. In Firebase Console, click the iOS icon (or "Add app")
2. Enter bundle ID: `com.dramadropapp` (check your `ios/DramaDropApp/Info.plist` for actual bundle ID)
3. Enter app nickname (optional): "DramaDrop iOS"
4. Enter App Store ID (optional)
5. Click "Register app"
6. Download `GoogleService-Info.plist`
7. Place the file at: `ios/GoogleService-Info.plist`
8. In Xcode, right-click the project and select "Add Files to DramaDropApp"
9. Select `GoogleService-Info.plist` and ensure "Copy items if needed" is checked

## Step 4: Enable Firebase Storage

1. In Firebase Console, go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development) or "Start in production mode" (for production)
4. Select a Cloud Storage location (choose closest to your users)
5. Click "Done"

### Storage Security Rules

For production, update your Storage security rules in Firebase Console:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all videos
    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can upload
    }
    
    // Allow read access to all thumbnails
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Install Dependencies

The Firebase dependencies have already been added to `package.json`. Run:

```bash
npm install
```

For iOS, install pods:

```bash
cd ios
pod install
cd ..
```

## Step 6: Upload Videos to Firebase Storage

### Option A: Using Firebase Console (Web UI)

1. Go to Firebase Console → Storage
2. Click "Get started" if you haven't already
3. Click "Upload file"
4. Create the following folder structure:

```
videos/
  ├── dramas/
  │   ├── 1/
  │   │   ├── episode-1.mp4
  │   │   └── episode-2.mp4
  │   ├── 2/
  │   │   └── episode-1.mp4
  │   └── ...
  └── foryou/
      ├── foryou-1.mp4
      ├── foryou-2.mp4
      └── ...

thumbnails/
  ├── dramas/
  │   ├── 1/
  │   │   ├── episode-1.jpg
  │   │   └── episode-2.jpg
  │   └── ...
  └── foryou/
      ├── foryou-1.jpg
      ├── foryou-2.jpg
      └── ...
```

### Option B: Using Firebase CLI

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init storage
```

4. Upload videos:
```bash
firebase storage:upload videos/dramas/1/episode-1.mp4 videos/dramas/1/episode-1.mp4
```

## Step 7: Configure Environment

The app is configured to use remote videos in production and local videos in development by default.

To change this behavior, edit `src/config/env.ts`:

```typescript
export const USE_REMOTE_VIDEOS = true; // Force remote videos
// or
export const USE_REMOTE_VIDEOS = false; // Force local videos
```

## Step 8: Update Video Data (Optional)

If you want to pre-configure Firebase Storage paths in your video data, you can add `videoStoragePath` and `thumbnailStoragePath` to video items in:

- `src/data/videoData.ts` (for drama episodes)
- `src/data/forYouVideos.ts` (for For You videos)

Example:

```typescript
{
  id: '1',
  title: 'Neon Alley: Episode 1',
  videoSource: require('../assets/videos/videoplayback-1.mp4'), // Fallback
  videoStoragePath: 'videos/dramas/1/episode-1.mp4', // Firebase path
  // ... other fields
}
```

## Step 9: Test the Integration

1. Build and run the app:
```bash
# Android
npm run android

# iOS
npm run ios
```

2. Check the console logs for Firebase initialization messages
3. Verify videos load from Firebase Storage (in production mode)

## Troubleshooting

### Android Build Errors

- **Error: "google-services.json not found"**
  - Ensure `google-services.json` is in `android/app/` directory
  - Clean and rebuild: `cd android && ./gradlew clean`

- **Error: "Plugin with id 'com.google.gms.google-services' not found"**
  - Check that `android/build.gradle` includes the Google Services classpath
  - Sync Gradle files in Android Studio

### iOS Build Errors

- **Error: "GoogleService-Info.plist not found"**
  - Ensure the file is added to Xcode project
  - Check that it's included in the app target

- **Pod Installation Errors**
  - Run `cd ios && pod deintegrate && pod install`
  - Clear derived data in Xcode

### Video Not Loading

- Check Firebase Storage security rules allow read access
- Verify video file paths match the storage structure
- Check network connectivity
- Review console logs for Firebase errors
- Ensure Firebase is initialized (check logs for "Firebase initialized successfully")

### Firebase Not Initializing

- Verify `google-services.json` and `GoogleService-Info.plist` are correctly placed
- Check that Firebase dependencies are installed: `npm list @react-native-firebase/app`
- Ensure you've run `pod install` for iOS

## Storage Structure Reference

```
videos/
  ├── dramas/
  │   ├── {dramaId}/
  │   │   ├── episode-{episodeNumber}.mp4
  │   │   └── ...
  │   └── ...
  └── foryou/
      ├── {videoId}.mp4
      └── ...

thumbnails/
  ├── dramas/
  │   ├── {dramaId}/
  │   │   ├── episode-{episodeNumber}.jpg
  │   │   └── ...
  │   └── ...
  └── foryou/
      ├── {videoId}.jpg
      └── ...
```

## Next Steps

- Set up Firebase Authentication if needed
- Configure Firebase Analytics for video viewing metrics
- Set up Cloud Functions for video processing/transcoding
- Implement video caching strategy
- Add video upload functionality from the app

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)

