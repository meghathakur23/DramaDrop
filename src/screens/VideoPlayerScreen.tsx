import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useSetAtom} from 'jotai';
import VideoFeed from '../components/VideoFeed';
import {allVideos, VideoItem} from '../data/videoData';
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
  videoId?: string;
  videos?: VideoItem[];
}

function VideoPlayerScreen() {
  const [isFocused, setIsFocused] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const route = useRoute();
  const params = (route.params as RouteParams) || {};
  const {videoId, videos: routeVideos} = params;
  const setWatchlist = useSetAtom(watchlistAtom);
  const setVideoProgress = useSetAtom(videoProgressAtom);

  // Initialize watchlist and video progress on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const watchlistData = await initializeWatchlist();
        setWatchlist(watchlistData);

        const progressData = await initializeVideoProgress();
        setVideoProgress(progressData);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing video player data:', error);
        setIsInitialized(true); // Still allow playback even if initialization fails
      }
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

  const handleVideoEnd = (endedVideoId: string) => {
    console.log('Video ended:', endedVideoId);
    // Handle video end logic (e.g., analytics, next video suggestion)
  };

  // Determine which videos to show
  let videosToShow: VideoItem[] = allVideos;
  
  if (routeVideos && routeVideos.length > 0) {
    // If specific videos provided, start with those and then continue with all videos
    const firstVideo = routeVideos[0];
    const remainingVideos = allVideos.filter(v => v.id !== firstVideo.id);
    videosToShow = [firstVideo, ...remainingVideos];
  } else if (videoId) {
    // If videoId provided, find that video and show it with others
    const videoIndex = allVideos.findIndex(v => v.id === videoId);
    if (videoIndex !== -1) {
      // Start from the selected video
      videosToShow = [
        ...allVideos.slice(videoIndex),
        ...allVideos.slice(0, videoIndex),
      ];
    }
  }

  // Don't render until progress is initialized to ensure progress is loaded
  if (!isInitialized) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <VideoFeed
        videos={videosToShow}
        onVideoEnd={handleVideoEnd}
        isScreenFocused={isFocused}
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

export default VideoPlayerScreen;

