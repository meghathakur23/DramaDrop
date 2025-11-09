/**
 * Watch History state management using Jotai + AsyncStorage
 * Tracks user's video watch history
 */

import {atom} from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatchHistoryItem {
  videoId: string;
  title: string;
  author: string;
  watchedAt: string; // ISO date string
  progress?: number; // Progress in seconds (optional)
  duration?: string; // Video duration
}

// Base atom for watch history
export const watchHistoryAtom = atom<WatchHistoryItem[]>([]);

// Maximum number of history items to keep
const MAX_HISTORY_ITEMS = 100;
const STORAGE_KEY = 'watchHistory';

/**
 * Initialize watch history from AsyncStorage
 */
export const initializeWatchHistory = async (): Promise<WatchHistoryItem[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as WatchHistoryItem[];
      // Sort by most recent first
      return parsed.sort((a, b) => 
        new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
      );
    }
    return [];
  } catch (error) {
    console.error('Error loading watch history:', error);
    return [];
  }
};

/**
 * Save watch history to AsyncStorage
 */
export const saveWatchHistory = async (
  history: WatchHistoryItem[],
): Promise<void> => {
  try {
    // Limit to MAX_HISTORY_ITEMS
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving watch history:', error);
  }
};

/**
 * Add video to watch history
 */
export const addToHistory = async (
  currentHistory: WatchHistoryItem[],
  item: Omit<WatchHistoryItem, 'watchedAt' | 'thumbnail'>,
  progress?: number,
): Promise<WatchHistoryItem[]> => {
  const now = new Date().toISOString();
  
  // Check if video already exists in history
  const existingIndex = currentHistory.findIndex(h => h.videoId === item.videoId);
  
  let updatedHistory: WatchHistoryItem[];
  
  if (existingIndex !== -1) {
    // Update existing entry
    updatedHistory = [...currentHistory];
    updatedHistory[existingIndex] = {
      ...item,
      watchedAt: now,
      progress: progress ?? updatedHistory[existingIndex].progress,
    };
  } else {
    // Add new entry
    updatedHistory = [
      {
        ...item,
        watchedAt: now,
        progress,
      },
      ...currentHistory,
    ];
  }
  
  // Sort by most recent first
  updatedHistory.sort((a, b) => 
    new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
  );
  
  await saveWatchHistory(updatedHistory);
  return updatedHistory;
};

/**
 * Remove video from watch history
 */
export const removeFromHistory = async (
  currentHistory: WatchHistoryItem[],
  videoId: string,
): Promise<WatchHistoryItem[]> => {
  const updatedHistory = currentHistory.filter(h => h.videoId !== videoId);
  await saveWatchHistory(updatedHistory);
  return updatedHistory;
};

/**
 * Clear all watch history
 */
export const clearHistory = async (): Promise<WatchHistoryItem[]> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return [];
};

/**
 * Get watch history
 */
export const getHistory = async (): Promise<WatchHistoryItem[]> => {
  return initializeWatchHistory();
};

