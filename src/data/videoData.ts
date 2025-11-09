/**
 * Drama episode video data structure
 * Used for drama-specific episodes in VideoPlayerScreen
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

// Drama episodes - organized by dramaId and episodeNumber
// Used in VideoPlayerScreen for drama-specific playback
// Note: Using videoplayback-1.mp4 for all episodes (can be updated later with actual episode videos)
export const dramaEpisodes: VideoItem[] = [
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
  // Code Breaker (dramaId: '6') - Latest Releases
  {
    id: '6',
    title: 'Code Breaker: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data1.png'),
    author: '@CodeMaster',
    likes: 2800,
    episodes: 10,
    shares: 95,
    duration: '2m',
    description: 'A thrilling code-breaking adventure that will keep you on the edge of your seat.',
    isLiked: false,
    isFollowing: false,
    dramaId: '6',
    episodeNumber: 1,
  },
  // Neon Nights (dramaId: '7') - Latest Releases
  {
    id: '7',
    title: 'Neon Nights: Episode 3',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data2.png'),
    author: '@NightVibes',
    likes: 3200,
    episodes: 12,
    shares: 120,
    duration: '5m',
    description: 'The night comes alive in this neon-lit urban drama.',
    isLiked: false,
    isFollowing: false,
    dramaId: '7',
    episodeNumber: 3,
  },
  // Virtual Reality (dramaId: '8') - Latest Releases
  {
    id: '8',
    title: 'Virtual Reality: Episode 2',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data3.png'),
    author: '@VRWorld',
    likes: 2100,
    episodes: 15,
    shares: 85,
    duration: '3m',
    description: 'Step into a world where reality and virtual merge.',
    isLiked: false,
    isFollowing: false,
    dramaId: '8',
    episodeNumber: 2,
  },
  // Electric Dreams (dramaId: '9') - Latest Releases (different from dramaId '5')
  {
    id: '9',
    title: 'Electric Dreams: Episode 4',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data4.png'),
    author: '@ElectricVibes',
    likes: 3800,
    episodes: 18,
    shares: 150,
    duration: '4m',
    description: 'Dreams become reality in this electrifying series.',
    isLiked: false,
    isFollowing: false,
    dramaId: '9',
    episodeNumber: 4,
  },
  // Digital Shadows (dramaId: '10') - Latest Releases
  {
    id: '10',
    title: 'Digital Shadows: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data5.png'),
    author: '@ShadowTech',
    likes: 2500,
    episodes: 14,
    shares: 100,
    duration: '2m',
    description: 'In the shadows of the digital world, secrets are revealed.',
    isLiked: false,
    isFollowing: false,
    dramaId: '10',
    episodeNumber: 1,
  },
  // Neon City (dramaId: '11') - For You
  {
    id: '11',
    title: 'Neon City: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data1.png'),
    author: '@CityLights',
    likes: 4200,
    episodes: 16,
    shares: 180,
    duration: '3m 30s',
    description: 'Explore the neon-lit streets of a futuristic city.',
    isLiked: false,
    isFollowing: false,
    dramaId: '11',
    episodeNumber: 1,
  },
  // Purple Rain (dramaId: '12') - For You
  {
    id: '12',
    title: 'Purple Rain: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data2.png'),
    author: '@RainMaker',
    likes: 3600,
    episodes: 13,
    shares: 140,
    duration: '4m',
    description: 'A story of love and loss in the rain.',
    isLiked: false,
    isFollowing: false,
    dramaId: '12',
    episodeNumber: 1,
  },
  // Blue Horizon (dramaId: '13') - For You
  {
    id: '13',
    title: 'Blue Horizon: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data3.png'),
    author: '@HorizonView',
    likes: 4100,
    episodes: 17,
    shares: 170,
    duration: '3m 15s',
    description: 'Journey beyond the horizon in this epic adventure.',
    isLiked: false,
    isFollowing: false,
    dramaId: '13',
    episodeNumber: 1,
  },
  // Midnight Run (dramaId: '14') - For You
  {
    id: '14',
    title: 'Midnight Run: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data4.png'),
    author: '@NightRunner',
    likes: 3900,
    episodes: 15,
    shares: 160,
    duration: '3m 45s',
    description: 'A thrilling chase through the midnight streets.',
    isLiked: false,
    isFollowing: false,
    dramaId: '14',
    episodeNumber: 1,
  },
  // Electric Pulse (dramaId: '15') - For You
  {
    id: '15',
    title: 'Electric Pulse: Episode 1',
    videoSource: require('../assets/videos/videoplayback-1.mp4'),
    thumbnail: require('../images/data5.png'),
    author: '@PulseEnergy',
    likes: 4400,
    episodes: 19,
    shares: 190,
    duration: '4m 20s',
    description: 'Feel the electric pulse of this high-energy drama.',
    isLiked: false,
    isFollowing: false,
    dramaId: '15',
    episodeNumber: 1,
  },
];

