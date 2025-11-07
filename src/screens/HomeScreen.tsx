import React, {useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAtom, useSetAtom} from 'jotai';
import {theme} from '../theme';
import AppHeader from '../components/AppHeader';
import SpotlightCarousel from '../components/SpotlightCarousel';
import HorizontalDramaList from '../components/HorizontalDramaList';
import {
  trendingDramas,
  latestReleases,
  forYouDramas,
  spotlightItems,
} from '../data/dummyData';
import {DramaItem} from '../data/dummyData';
import {
  watchlistAtom,
  addToWatchlist,
  removeFromWatchlist,
  initializeWatchlist,
} from '../store/watchlistAtoms';

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

  // Tab bar height is 60 + bottom inset, add extra padding for spacing
  const tabBarHeight = 60 + insets.bottom;
  const bottomPadding = tabBarHeight + theme.spacing.xl;

  const handleDramaPress = (item: DramaItem) => {
    // Navigate to ForYou screen with dramaId
    navigation.navigate('ForYou' as never, {dramaId: item.id} as never);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        <AppHeader />
        <SpotlightCarousel data={spotlightItems} />
        
        <HorizontalDramaList
          title="Trending Dramas"
          actionText="See all"
          data={trendingDramas}
          onActionPress={() => {}}
          onDramaPress={handleDramaPress}
          onDramaSave={handleDramaSave}
        />
        
        <HorizontalDramaList
          title="Latest Releases"
          actionText="View"
          data={latestReleases}
          onActionPress={() => {}}
          showPlayIcon={true}
          onDramaPress={handleDramaPress}
          onDramaSave={handleDramaSave}
        />
        
        <HorizontalDramaList
          title="For You"
          actionText="Refresh"
          data={forYouDramas}
          onActionPress={() => {}}
          showAddIcon={true}
          onDramaPress={handleDramaPress}
          onDramaSave={handleDramaSave}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // paddingBottom will be set dynamically based on tab bar height
  },
});

export default HomeScreen;

