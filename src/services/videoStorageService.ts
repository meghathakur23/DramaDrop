/**
 * Video Storage Service
 * Handles video URL retrieval and upload from Firebase Storage
 */

import {getStorageRef, isFirebaseAvailable} from './firebaseConfig';
import {
  getDramaEpisodePath,
  getDramaThumbnailPath,
  getForYouVideoPath,
  getForYouThumbnailPath,
} from '../config/env';

/**
 * Get download URL for a video from Firebase Storage
 * @param path - Storage path to the video file
 * @returns Promise resolving to the download URL, or null if unavailable
 */
export const getVideoUrl = async (path: string): Promise<string | null> => {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available, cannot get video URL');
      return null;
    }

    const storageRef = getStorageRef(path);
    const url = await storageRef.getDownloadURL();
    return url;
  } catch (error) {
    console.error(`Error getting video URL for path ${path}:`, error);
    return null;
  }
};

/**
 * Get download URL for a drama episode video
 * @param dramaId - Drama ID
 * @param episodeNumber - Episode number
 * @returns Promise resolving to the download URL, or null if unavailable
 */
export const getDramaEpisodeUrl = async (
  dramaId: string,
  episodeNumber: number,
): Promise<string | null> => {
  const path = getDramaEpisodePath(dramaId, episodeNumber);
  return getVideoUrl(path);
};

/**
 * Get download URL for a For You video
 * @param videoId - Video ID
 * @returns Promise resolving to the download URL, or null if unavailable
 */
export const getForYouVideoUrl = async (videoId: string): Promise<string | null> => {
  const path = getForYouVideoPath(videoId);
  return getVideoUrl(path);
};

/**
 * Get download URL for a thumbnail image
 * @param path - Storage path to the thumbnail
 * @returns Promise resolving to the download URL, or null if unavailable
 */
export const getThumbnailUrl = async (path: string): Promise<string | null> => {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available, cannot get thumbnail URL');
      return null;
    }

    const storageRef = getStorageRef(path);
    const url = await storageRef.getDownloadURL();
    return url;
  } catch (error) {
    console.error(`Error getting thumbnail URL for path ${path}:`, error);
    return null;
  }
};

/**
 * Get download URL for a drama episode thumbnail
 * @param dramaId - Drama ID
 * @param episodeNumber - Episode number
 * @returns Promise resolving to the download URL, or null if unavailable
 */
export const getDramaThumbnailUrl = async (
  dramaId: string,
  episodeNumber: number,
): Promise<string | null> => {
  const path = getDramaThumbnailPath(dramaId, episodeNumber);
  return getThumbnailUrl(path);
};

/**
 * Get download URL for a For You video thumbnail
 * @param videoId - Video ID
 * @returns Promise resolving to the download URL, or null if unavailable
 */
export const getForYouThumbnailUrl = async (videoId: string): Promise<string | null> => {
  const path = getForYouThumbnailPath(videoId);
  return getThumbnailUrl(path);
};

/**
 * Upload a video file to Firebase Storage
 * @param fileUri - Local file URI to upload
 * @param path - Storage path where the file should be stored
 * @param onProgress - Optional progress callback
 * @returns Promise resolving to the download URL of the uploaded file
 */
export const uploadVideo = async (
  fileUri: string,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<string | null> => {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available, cannot upload video');
      return null;
    }

    const storageRef = getStorageRef(path);
    const task = storageRef.putFile(fileUri);

    // Monitor upload progress
    if (onProgress) {
      task.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });
    }

    await task;
    const downloadUrl = await storageRef.getDownloadURL();
    return downloadUrl;
  } catch (error) {
    console.error(`Error uploading video to path ${path}:`, error);
    return null;
  }
};

/**
 * Delete a video from Firebase Storage
 * @param path - Storage path to the file
 * @returns Promise resolving to true if successful, false otherwise
 */
export const deleteVideo = async (path: string): Promise<boolean> => {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available, cannot delete video');
      return false;
    }

    const storageRef = getStorageRef(path);
    await storageRef.delete();
    return true;
  } catch (error) {
    console.error(`Error deleting video at path ${path}:`, error);
    return false;
  }
};

