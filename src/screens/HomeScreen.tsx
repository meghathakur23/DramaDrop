import React, {useEffect, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAtom, useSetAtom} from 'jotai';
import {theme} from '../theme';
import AppHeader from '../components/AppHeader';
import SpotlightCarousel from '../components/SpotlightCarousel';
import DramaCard from '../components/DramaCard';
import {
  trendingDramas,
  latestReleases,
  forYouDramas,
  spotlightItems,
} from '../data/dummyData';
import {DramaItem} from '../data/dummyData';
import {allVideos} from '../data/videoData';
import {
  watchlistAtom,
  addToWatchlist,
  removeFromWatchlist,
  initializeWatchlist,
} from '../store/watchlistAtoms';

const NUM_COLUMNS = 3;

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const setWatchlistAtom = useSetAtom(watchlistAtom);

  // Initialize watchlist on mount
  useEffect(() => {
    const initWatchlist = async () => {
      const watchlistData = await initializeWatchlist();
      setWatchlistAtom(watchlistData);
    };
    initWatchlist();
  }, [setWatchlistAtom]);

  // Combine all dramas: Trending → Latest Releases → For You
  const allDramas = useMemo(() => {
    return [...trendingDramas, ...latestReleases, ...forYouDramas];
  }, []);

  // Tab bar height is 60 + bottom inset, add extra padding for spacing
  const tabBarHeight = 60 + insets.bottom;
  const bottomPadding = tabBarHeight + theme.spacing.xl;

  const handleDramaPress = (item: DramaItem) => {
    // Find the corresponding video from allVideos
    const video = allVideos.find(v => v.id === item.id);
    
    if (video) {
      // Navigate to VideoPlayer screen with the video
      (navigation as any).navigate('VideoPlayer', {
        videoId: video.id,
        videos: [video], // Pass single video as array to start from this video
      });
    } else {
      // Fallback: navigate with videoId only
      (navigation as any).navigate('VideoPlayer', {videoId: item.id});
    }
  };

  const handleDramaSave = async (item: DramaItem) => {
    // Check if already in watchlist
    const isCurrentlySaved = watchlist.some(drama => drama.id === item.id);
    if (isCurrentlySaved) {
      // Remove from watchlist
      const updated = await removeFromWatchlist(watchlist, item.id);
      setWatchlist(updated);
    } else {
      // Add to watchlist
      const updated = await addToWatchlist(watchlist, item);
      setWatchlist(updated);
    }
  };

  // Determine which icons to show based on which section the drama came from
  const getDramaProps = (item: DramaItem) => {
    const isFromLatestReleases = latestReleases.some(d => d.id === item.id);
    const isFromForYou = forYouDramas.some(d => d.id === item.id);
    
    return {
      showPlayIcon: isFromLatestReleases,
      showAddIcon: isFromForYou,
    };
  };

  const renderDramaCard = ({item}: {item: DramaItem}) => {
    const {showPlayIcon, showAddIcon} = getDramaProps(item);
    return (
      <DramaCard
        item={item}
        showPlayIcon={showPlayIcon}
        showAddIcon={showAddIcon}
        onPress={() => handleDramaPress(item)}
        onSavePress={() => handleDramaSave(item)}
      />
    );
  };

  const renderHeader = () => (
    <View>
      <AppHeader />
      <View style={styles.spotlightWrapper}>
        <SpotlightCarousel data={spotlightItems} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={allDramas}
        renderItem={renderDramaCard}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[styles.listContent, {paddingBottom: bottomPadding}]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.sm, // Reduced from base (16px) to sm (8px)
    paddingTop: theme.spacing.sm,
  },
  row: {
    marginBottom: theme.spacing.md,
  },
  spotlightWrapper: {
    marginHorizontal: -theme.spacing.sm, // Negative margin to counteract listContent padding
  },
});

export default HomeScreen;

