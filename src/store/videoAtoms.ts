/**
 * Jotai atoms for video interactions state management
 */

import {atom} from 'jotai';

export interface VideoInteraction {
  isLiked?: boolean;
  isFollowing?: boolean;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface VideoInteractions {
  [videoId: string]: VideoInteraction;
}

// Atom to store video interactions (likes, follows, etc.)
export const videoInteractionsAtom = atom<VideoInteractions>({});

