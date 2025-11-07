import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../theme';
import AppHeader from '../components/AppHeader';
import SpotlightBanner from '../components/SpotlightBanner';
import HorizontalDramaList from '../components/HorizontalDramaList';
import {
  trendingDramas,
  latestReleases,
  forYouDramas,
} from '../data/dummyData';

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AppHeader />
        <SpotlightBanner />
        
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
    paddingBottom: theme.spacing.xl,
  },
});

export default HomeScreen;

