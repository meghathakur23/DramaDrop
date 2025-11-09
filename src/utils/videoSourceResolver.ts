/**
 * Video Source Resolver
 * Resolves video sources based on environment (local dev vs remote prod)
 */

import {ImageSourcePropType} from 'react-native';
import {USE_REMOTE_VIDEOS} from '../config/env';
import {VideoSource} from '../data/videoData';
import {
  getDramaEpisodeUrl,
  getForYouVideoUrl,
} from '../services/videoStorageService';

/**
 * Resolve video source for react-native-video component
 * Handles both local require() and remote URL formats
 */
export const resolveVideoSource = (
  videoSource: VideoSource,
): {uri?: string} | ImageSourcePropType => {
  // If it's already a string (URL), return as {uri: string}
  if (typeof videoSource === 'string') {
    return {uri: videoSource};
  }
  // If it's a local require(), return as-is
  return videoSource;
};

/**
 * Get video source for a drama episode
 * Returns Firebase Storage URL in production, local require() in development
 */
export const getDramaEpisodeSource = async (
  dramaId: string,
  episodeNumber: number,
  fallbackLocalSource: ImageSourcePropType,
): Promise<VideoSource> => {
  if (USE_REMOTE_VIDEOS) {
    const url = await getDramaEpisodeUrl(dramaId, episodeNumber);
    if (url) {
      return url;
    }
    // Fallback to local if Firebase URL not available
    console.warn(
      `Firebase URL not available for drama ${dramaId} episode ${episodeNumber}, using local fallback`,
    );
  }
  return fallbackLocalSource;
};

/**
 * Get video source for a For You video
 * Returns Firebase Storage URL in production, local require() in development
 */
export const getForYouVideoSource = async (
  videoId: string,
  fallbackLocalSource: ImageSourcePropType,
): Promise<VideoSource> => {
  if (USE_REMOTE_VIDEOS) {
    const url = await getForYouVideoUrl(videoId);
    if (url) {
      return url;
    }
    // Fallback to local if Firebase URL not available
    console.warn(
      `Firebase URL not available for For You video ${videoId}, using local fallback`,
    );
  }
  return fallbackLocalSource;
};

/**
 * Check if a video source is a remote URL
 */
export const isRemoteSource = (source: VideoSource): boolean => {
  return typeof source === 'string';
};

