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
}

export const trendingDramas: DramaItem[] = [
  {
    id: '1',
    title: 'Neon Alley',
    image: require('../images/data1.png'),
  },
  {
    id: '2',
    title: 'Violet Code',
    image: require('../images/data2.png'),
  },
  {
    id: '3',
    title: 'Cyber Dreams',
    image: require('../images/data3.png'),
  },
  {
    id: '4',
    title: 'Digital Love',
    image: require('../images/data4.png'),
  },
  {
    id: '5',
    title: 'Neon Hearts',
    image: require('../images/data5.png'),
  },
];

export const latestReleases: DramaItem[] = [
  {
    id: '6',
    title: 'Code Breaker',
    image: require('../images/data1.png'),
    episodeInfo: 'Ep 1 • 2m',
  },
  {
    id: '7',
    title: 'Neon Nights',
    image: require('../images/data2.png'),
    episodeInfo: 'Ep 3 • 5m',
  },
  {
    id: '8',
    title: 'Virtual Reality',
    image: require('../images/data3.png'),
    episodeInfo: 'Ep 2 • 3m',
  },
  {
    id: '9',
    title: 'Electric Dreams',
    image: require('../images/data4.png'),
    episodeInfo: 'Ep 4 • 4m',
  },
  {
    id: '10',
    title: 'Digital Shadows',
    image: require('../images/data5.png'),
    episodeInfo: 'Ep 1 • 2m',
  },
];

export const forYouDramas: DramaItem[] = [
  {
    id: '11',
    title: 'Neon City',
    image: require('../images/data1.png'),
    matchPercentage: 94,
  },
  {
    id: '12',
    title: 'Purple Rain',
    image: require('../images/data2.png'),
    matchPercentage: 87,
  },
  {
    id: '13',
    title: 'Blue Horizon',
    image: require('../images/data3.png'),
    matchPercentage: 92,
  },
  {
    id: '14',
    title: 'Midnight Run',
    image: require('../images/data4.png'),
    matchPercentage: 89,
  },
  {
    id: '15',
    title: 'Electric Pulse',
    image: require('../images/data5.png'),
    matchPercentage: 96,
  },
];

