/**
 * Video data structure for For You feed
 */

import {ImageSourcePropType} from 'react-native';

export interface VideoItem {
  id: string;
  title: string;
  videoSource: ImageSourcePropType; // For local videos, we'll use require() which returns ImageSourcePropType
  thumbnail: ImageSourcePropType;
  author: string;
  authorAvatar?: ImageSourcePropType;
  likes: number;
  episodes: number;
  shares: number;
  duration: string;
  description: string;
  isLiked?: boolean;
  isFollowing?: boolean;
  dramaId: string; // Links episodes to dramas
  episodeNumber: number; // Episode order (1, 2, 3, etc.)
}

// Helper function to get first episode for a drama
export const getFirstEpisodeForDrama = (
  videos: VideoItem[],
  dramaId: string,
): VideoItem | undefined => {
  return videos.find(video => video.dramaId === dramaId && video.episodeNumber === 1);
};

// Helper function to get all episodes for a drama
export const getEpisodesForDrama = (
  videos: VideoItem[],
  dramaId: string,
): VideoItem[] => {
  return videos
    .filter(video => video.dramaId === dramaId)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
};

// Note: Using videoplayback-1.mp4 for all episodes (can be updated later with actual episode videos)
// Episodes are organized by dramaId and episodeNumber
export const dummyVideos: VideoItem[] = [
  // Neon Alley (dramaId: '1') - Episodes
  {
    id: '1',
    title: 'Neon Alley: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data1.png'),
    author: '@NovaJ',
    likes: 2100,
    episodes: 12,
    shares: 80,
    duration: '39m',
    description: 'A thrilling sci-fi drama in a cyberpunk city. Watch as our hero navigates through neon-lit streets.',
    isLiked: false,
    isFollowing: false,
    dramaId: '1',
    episodeNumber: 1,
  },
  {
    id: '1-2',
    title: 'Neon Alley: Episode 2',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data1.png'),
    author: '@NovaJ',
    likes: 1950,
    episodes: 12,
    shares: 75,
    duration: '38m',
    description: 'The adventure continues as new challenges arise.',
    isLiked: false,
    isFollowing: false,
    dramaId: '1',
    episodeNumber: 2,
  },
  // Violet Code (dramaId: '2') - Episodes
  {
    id: '2',
    title: 'Violet Code: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data2.png'),
    author: '@CyberDreams',
    likes: 1850,
    episodes: 8,
    shares: 65,
    duration: '3m',
    description: 'The mystery deepens as secrets are revealed. Who can you trust in this digital world?',
    isLiked: false,
    isFollowing: false,
    dramaId: '2',
    episodeNumber: 1,
  },
  // Digital Love (dramaId: '3') - Episodes
  {
    id: '3',
    title: 'Digital Love: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data3.png'),
    author: '@NeonHearts',
    likes: 3200,
    episodes: 15,
    shares: 150,
    duration: '4m',
    description: 'A romantic drama set in a futuristic world where technology meets emotion.',
    isLiked: false,
    isFollowing: false,
    dramaId: '3',
    episodeNumber: 1,
  },
  // Code Breaker (dramaId: '4') - Episodes
  {
    id: '4',
    title: 'Code Breaker: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data4.png'),
    author: '@VirtualReality',
    likes: 1450,
    episodes: 10,
    shares: 45,
    duration: '2m 30s',
    description: 'The final showdown approaches. Can our hero break the code and save the day?',
    isLiked: false,
    isFollowing: false,
    dramaId: '4',
    episodeNumber: 1,
  },
  // Electric Dreams (dramaId: '5') - Episodes
  {
    id: '5',
    title: 'Electric Dreams: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data5.png'),
    author: '@DigitalShadows',
    likes: 4500,
    episodes: 20,
    shares: 210,
    duration: '5m',
    description: 'The epic conclusion to an amazing journey. Everything comes together in this stunning finale.',
    isLiked: false,
    isFollowing: false,
    dramaId: '5',
    episodeNumber: 1,
  },
];

