import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useSetAtom} from 'jotai';
import VideoFeed from '../components/VideoFeed';
import {dummyVideos} from '../data/videoData';
import {theme} from '../theme';
import {
  watchlistAtom,
  initializeWatchlist,
} from '../store/watchlistAtoms';
import {
  videoProgressAtom,
  initializeVideoProgress,
} from '../store/videoProgressAtoms';

interface RouteParams {
  dramaId?: string;
}

function ForYouScreen() {
  const [isFocused, setIsFocused] = useState(true);
  const route = useRoute();
  const params = (route.params as RouteParams) || {};
  const dramaId = params.dramaId;
  const setWatchlist = useSetAtom(watchlistAtom);
  const setVideoProgress = useSetAtom(videoProgressAtom);

  // Initialize watchlist and video progress on mount
  useEffect(() => {
    const initializeData = async () => {
      const watchlistData = await initializeWatchlist();
      setWatchlist(watchlistData);

      const progressData = await initializeVideoProgress();
      setVideoProgress(progressData);
    };
    initializeData();
  }, [setWatchlist, setVideoProgress]);

  // Hide status bar for full-screen video experience and manage focus state
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(true, 'fade');
      setIsFocused(true);
      return () => {
        StatusBar.setHidden(false, 'fade');
        setIsFocused(false);
      };
    }, []),
  );

  const handleVideoEnd = (videoId: string) => {
    console.log('Video ended:', videoId);
    // Handle video end logic (e.g., analytics, next video suggestion)
  };

  return (
    <View style={styles.container}>
      <VideoFeed
        videos={dummyVideos}
        onVideoEnd={handleVideoEnd}
        isScreenFocused={isFocused}
        initialDramaId={dramaId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});

export default ForYouScreen;

