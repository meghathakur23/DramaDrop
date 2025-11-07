/**
 * Video progress tracking using Jotai + AsyncStorage
 * Tracks last watched position for each video/episode
 */

import {atom} from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VideoProgress {
  currentTime: number; // Time in seconds
  duration: number; // Total duration in seconds
  timestamp: number; // When progress was saved
}

// Base atom for video progress (synchronous)
// Format: { [videoId]: { progress: number, timestamp: number } }
export const videoProgressAtom = atom<Record<string, VideoProgress>>({});

// Initialize video progress from AsyncStorage
export const initializeVideoProgress = async (): Promise<Record<string, VideoProgress>> => {
  try {
    const stored = await AsyncStorage.getItem('videoProgress');
    if (stored) {
      return JSON.parse(stored) as Record<string, VideoProgress>;
    }
    return {};
  } catch (error) {
    console.error('Error loading video progress:', error);
    return {};
  }
};

// Helper to save video progress to AsyncStorage
export const saveVideoProgress = async (
  progress: Record<string, VideoProgress>,
): Promise<void> => {
  try {
    await AsyncStorage.setItem('videoProgress', JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving video progress:', error);
  }
};

// Helper to get current time for a specific video
export const getVideoProgress = (
  progress: Record<string, VideoProgress>,
  videoId: string,
): number => {
  const videoProgress = progress[videoId];
  return videoProgress?.currentTime ?? 0;
};

// Helper to update progress for a specific video
export const updateVideoProgress = async (
  progress: Record<string, VideoProgress>,
  videoId: string,
  currentTime: number,
  duration: number,
): Promise<Record<string, VideoProgress>> => {
  const updated = {
    ...progress,
    [videoId]: {
      currentTime,
      duration,
      timestamp: Date.now(),
    },
  };
  await saveVideoProgress(updated);
  return updated;
};

