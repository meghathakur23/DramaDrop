/**
 * Watchlist state management using Jotai + AsyncStorage
 * Persists saved dramas across app restarts
 */

import {atom} from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DramaItem} from '../data/dummyData';

// Base atom for watchlist (synchronous)
export const watchlistAtom = atom<DramaItem[]>([]);

// Initialize watchlist from AsyncStorage
export const initializeWatchlist = async (): Promise<DramaItem[]> => {
  try {
    const stored = await AsyncStorage.getItem('watchlist');
    if (stored) {
      return JSON.parse(stored) as DramaItem[];
    }
    return [];
  } catch (error) {
    console.error('Error loading watchlist:', error);
    return [];
  }
};

// Helper to save watchlist to AsyncStorage
export const saveWatchlist = async (watchlist: DramaItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
  } catch (error) {
    console.error('Error saving watchlist:', error);
  }
};

// Helper to add drama to watchlist
export const addToWatchlist = async (
  watchlist: DramaItem[],
  drama: DramaItem,
): Promise<DramaItem[]> => {
  // Check if already in watchlist
  if (watchlist.some(item => item.id === drama.id)) {
    return watchlist;
  }
  const updated = [...watchlist, drama];
  await saveWatchlist(updated);
  return updated;
};

// Helper to remove drama from watchlist
export const removeFromWatchlist = async (
  watchlist: DramaItem[],
  dramaId: string,
): Promise<DramaItem[]> => {
  const updated = watchlist.filter(item => item.id !== dramaId);
  await saveWatchlist(updated);
  return updated;
};

// Derived atom to check if a drama is in watchlist
export const isInWatchlistAtom = atom(
  (get): ((dramaId: string) => boolean) => {
    const watchlist = get(watchlistAtom);
    return (dramaId: string) => watchlist.some(item => item.id === dramaId);
  },
);

