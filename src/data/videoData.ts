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
}

// Note: For now, we'll use placeholder image sources for videos
// In production, replace with actual local video files (e.g., require('../assets/videos/video1.mp4'))
// For prototype, we can use images as placeholders until actual videos are added
export const dummyVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Neon Alley: Episode 3',
    videoSource: require('../video/video1.mp4'),
    thumbnail: require('../images/data1.png'),
    author: '@NovaJ',
    likes: 2100,
    episodes: 12,
    shares: 80,
    duration: '39m',
    description: 'A thrilling sci-fi drama in a cyberpunk city. Watch as our hero navigates through neon-lit streets.',
    isLiked: false,
    isFollowing: false,
  },
  {
    id: '2',
    title: 'Violet Code: Chapter 2',
    videoSource: require('../video/video1.mp4'), // Using same video for now - replace with actual video file
    thumbnail: require('../images/data2.png'),
    author: '@CyberDreams',
    likes: 1850,
    episodes: 8,
    shares: 65,
    duration: '3m',
    description: 'The mystery deepens as secrets are revealed. Who can you trust in this digital world?',
    isLiked: false,
    isFollowing: false,
  },
  {
    id: '3',
    title: 'Digital Love: Part 1',
    videoSource: require('../video/video1.mp4'), // Using same video for now - replace with actual video file
    thumbnail: require('../images/data3.png'),
    author: '@NeonHearts',
    likes: 3200,
    episodes: 15,
    shares: 150,
    duration: '4m',
    description: 'A romantic drama set in a futuristic world where technology meets emotion.',
    isLiked: false,
    isFollowing: false,
  },
  {
    id: '4',
    title: 'Code Breaker: Episode 5',
    videoSource: require('../video/video1.mp4'), // Using same video for now - replace with actual video file
    thumbnail: require('../images/data4.png'),
    author: '@VirtualReality',
    likes: 1450,
    episodes: 10,
    shares: 45,
    duration: '2m 30s',
    description: 'The final showdown approaches. Can our hero break the code and save the day?',
    isLiked: false,
    isFollowing: false,
  },
  {
    id: '5',
    title: 'Electric Dreams: Season Finale',
    videoSource: require('../video/video1.mp4'), // Using same video for now - replace with actual video file
    thumbnail: require('../images/data5.png'),
    author: '@DigitalShadows',
    likes: 4500,
    episodes: 20,
    shares: 210,
    duration: '5m',
    description: 'The epic conclusion to an amazing journey. Everything comes together in this stunning finale.',
    isLiked: false,
    isFollowing: false,
  },
];

