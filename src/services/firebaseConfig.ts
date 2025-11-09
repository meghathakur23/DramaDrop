/**
 * Firebase configuration and initialization
 * NOTE: Currently disabled - Firebase integration will be added later
 * For now, using local video files
 */

/**
 * Initialize Firebase app
 * Firebase auto-initializes from google-services.json (Android) and GoogleService-Info.plist (iOS)
 * This function ensures Firebase is ready to use
 */
export const initializeFirebase = async (): Promise<boolean> => {
  // Firebase disabled for now - using local videos
  return false;
};

/**
 * Get Firebase Storage reference
 */
export const getStorage = () => {
  // Stub - Firebase not configured yet
  return null as any;
};

/**
 * Get storage reference for a specific path
 */
export const getStorageRef = (_path: string) => {
  // Stub - Firebase not configured yet
  return {
    getDownloadURL: async () => '',
    putFile: () => ({
      on: () => {},
    }),
    delete: async () => {},
  } as any;
};

/**
 * Check if Firebase is available
 */
export const isFirebaseAvailable = (): boolean => {
  // Firebase disabled for now - using local videos
  return false;
};

