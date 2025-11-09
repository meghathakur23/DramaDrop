/**
 * Dummy data for Home screen sections
 */

import {ImageSourcePropType} from 'react-native';

export interface DramaItem {
  id: string;
  title: string;
  image: ImageSourcePropType; // Local image require or URI
  episodeInfo?: string; // e.g., "Ep 1 • 2m"
  matchPercentage?: number; // e.g., 94
  isPremium?: boolean; // Premium content flag
}

export const trendingDramas: DramaItem[] = [
  {
    id: '1',
    title: 'Neon Alley',
    image: require('../images/data1.png'),
    isPremium: false,
  },
  {
    id: '2',
    title: 'Violet Code',
    image: require('../images/data2.png'),
    isPremium: true,
  },
  {
    id: '3',
    title: 'Cyber Dreams',
    image: require('../images/data3.png'),
    isPremium: false,
  },
  {
    id: '4',
    title: 'Digital Love',
    image: require('../images/data4.png'),
    isPremium: true,
  },
  {
    id: '5',
    title: 'Neon Hearts',
    image: require('../images/data5.png'),
    isPremium: false,
  },
];

export const latestReleases: DramaItem[] = [
  {
    id: '6',
    title: 'Code Breaker',
    image: require('../images/data1.png'),
    episodeInfo: 'Ep 1 • 2m',
    isPremium: true,
  },
  {
    id: '7',
    title: 'Neon Nights',
    image: require('../images/data2.png'),
    episodeInfo: 'Ep 3 • 5m',
    isPremium: false,
  },
  {
    id: '8',
    title: 'Virtual Reality',
    image: require('../images/data3.png'),
    episodeInfo: 'Ep 2 • 3m',
    isPremium: true,
  },
  {
    id: '9',
    title: 'Electric Dreams',
    image: require('../images/data4.png'),
    episodeInfo: 'Ep 4 • 4m',
    isPremium: false,
  },
  {
    id: '10',
    title: 'Digital Shadows',
    image: require('../images/data5.png'),
    episodeInfo: 'Ep 1 • 2m',
    isPremium: true,
  },
];

export const forYouDramas: DramaItem[] = [
  {
    id: '11',
    title: 'Neon City',
    image: require('../images/data1.png'),
    matchPercentage: 94,
    isPremium: false,
  },
  {
    id: '12',
    title: 'Purple Rain',
    image: require('../images/data2.png'),
    matchPercentage: 87,
    isPremium: true,
  },
  {
    id: '13',
    title: 'Blue Horizon',
    image: require('../images/data3.png'),
    matchPercentage: 92,
    isPremium: false,
  },
  {
    id: '14',
    title: 'Midnight Run',
    image: require('../images/data4.png'),
    matchPercentage: 89,
    isPremium: true,
  },
  {
    id: '15',
    title: 'Electric Pulse',
    image: require('../images/data5.png'),
    matchPercentage: 96,
    isPremium: false,
  },
];

export interface SpotlightItem {
  id: string;
  title: string;
  image: ImageSourcePropType;
}

export const spotlightItems: SpotlightItem[] = [
  {
    id: 'spotlight1',
    title: 'Tonight\'s Spotlight',
    image: require('../images/data1.png'),
  },
  {
    id: 'spotlight2',
    title: 'Tonight\'s Spotlight',
    image: require('../images/data2.png'),
  },
  {
    id: 'spotlight3',
    title: 'Tonight\'s Spotlight',
    image: require('../images/data3.png'),
  },
  {
    id: 'spotlight4',
    title: 'Tonight\'s Spotlight',
    image: require('../images/data4.png'),
  },
  {
    id: 'spotlight5',
    title: 'Tonight\'s Spotlight',
    image: require('../images/data5.png'),
  },
];

