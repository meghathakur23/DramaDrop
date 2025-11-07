import React, {useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import VideoFeed from '../components/VideoFeed';
import {dummyVideos} from '../data/videoData';
import {theme} from '../theme';

function ForYouScreen() {
  const [isFocused, setIsFocused] = useState(true);

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
      <VideoFeed videos={dummyVideos} onVideoEnd={handleVideoEnd} isScreenFocused={isFocused} />
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

