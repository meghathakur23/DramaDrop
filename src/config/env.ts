/**
 * Environment configuration for Firebase and app settings
 */

// Environment detection
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Firebase configuration
// These values should match your Firebase project settings
export const firebaseConfig = {
  // Note: Firebase will auto-initialize from google-services.json (Android) 
  // and GoogleService-Info.plist (iOS) files
  // These are just for reference/documentation
};

// Storage bucket paths
export const STORAGE_PATHS = {
  DRAMAS: 'videos/dramas',
  FOR_YOU: 'videos/foryou',
  THUMBNAILS: 'thumbnails',
} as const;

// Feature flags
export const USE_REMOTE_VIDEOS = isProduction; // Use remote videos in production, local in dev
export const ENABLE_VIDEO_UPLOAD = false; // Enable video upload functionality

// Helper to get storage path for drama episode
export const getDramaEpisodePath = (dramaId: string, episodeNumber: number): string => {
  return `${STORAGE_PATHS.DRAMAS}/${dramaId}/episode-${episodeNumber}.mp4`;
};

// Helper to get storage path for drama thumbnail
export const getDramaThumbnailPath = (dramaId: string, episodeNumber: number): string => {
  return `${STORAGE_PATHS.THUMBNAILS}/dramas/${dramaId}/episode-${episodeNumber}.jpg`;
};

// Helper to get storage path for For You video
export const getForYouVideoPath = (videoId: string): string => {
  return `${STORAGE_PATHS.FOR_YOU}/${videoId}.mp4`;
};

// Helper to get storage path for For You thumbnail
export const getForYouThumbnailPath = (videoId: string): string => {
  return `${STORAGE_PATHS.THUMBNAILS}/foryou/${videoId}.jpg`;
};

