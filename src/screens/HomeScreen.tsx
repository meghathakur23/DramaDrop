import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
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

function HomeScreen() {
  const insets = useSafeAreaInsets();
  // Tab bar height is 60 + bottom inset, add extra padding for spacing
  const tabBarHeight = 60 + insets.bottom;
  const bottomPadding = tabBarHeight + theme.spacing.xl;

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
        />
        
        <HorizontalDramaList
          title="Latest Releases"
          actionText="View"
          data={latestReleases}
          onActionPress={() => {}}
          showPlayIcon={true}
        />
        
        <HorizontalDramaList
          title="For You"
          actionText="Refresh"
          data={forYouDramas}
          onActionPress={() => {}}
          showAddIcon={true}
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

