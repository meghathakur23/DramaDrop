import React, {useRef, useState, useCallback, useEffect} from 'react';
import {View, FlatList, StyleSheet, Dimensions, ViewToken} from 'react-native';
import {useAtom, useSetAtom} from 'jotai';
import VideoCard from './VideoCard';
import {VideoItem} from '../data/videoData';
import {theme} from '../theme';
import {videoInteractionsAtom} from '../store/videoAtoms';
import {videoProgressAtom, getVideoProgress} from '../store/videoProgressAtoms';
import {
  watchHistoryAtom,
  addToHistory,
} from '../store/watchHistoryAtoms';

const {height: WINDOW_HEIGHT} = Dimensions.get('window');

interface VideoFeedProps {
  videos: VideoItem[];
  onVideoEnd?: (videoId: string) => void;
  isScreenFocused?: boolean;
}

function VideoFeed({
  videos,
  onVideoEnd: _onVideoEnd,
  isScreenFocused = true,
}: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null); // Track manually played videos
  const flatListRef = useRef<FlatList>(null);
  const [interactions, setInteractions] = useAtom(videoInteractionsAtom);
  const [videoProgress] = useAtom(videoProgressAtom);
  const [watchHistory, setWatchHistory] = useAtom(watchHistoryAtom);
  const setWatchHistoryAtom = useSetAtom(watchHistoryAtom);

  // Viewability configuration for detecting visible items
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Consider item visible if 50% is on screen
    minimumViewTime: 300, // Item must be visible for at least 300ms
  }).current;

  // Handle when viewable items change
  const onViewableItemsChanged = useCallback(
    async ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        const newActiveIndex = viewableItems[0].index ?? 0;
        if (newActiveIndex !== activeIndex) {
          setActiveIndex(newActiveIndex);
          
          // Pause the previously playing video when scrolling away
          if (playingVideoId && videos[activeIndex]?.id !== playingVideoId) {
            // Clear playing video ID when scrolling to a different video
            setPlayingVideoId(null);
          }
          
          // Track video in watch history when it becomes active
          if (isScreenFocused && videos[newActiveIndex]) {
            const activeVideo = videos[newActiveIndex];
            const progress = getVideoProgress(videoProgress, activeVideo.id);
            
            const updatedHistory = await addToHistory(
              watchHistory,
              {
                videoId: activeVideo.id,
                title: activeVideo.title,
                author: activeVideo.author,
                duration: activeVideo.duration,
              },
              progress,
            );
            setWatchHistoryAtom(updatedHistory);
          }
        }
      }
    },
    [activeIndex, isScreenFocused, videos, videoProgress, watchHistory, setWatchHistoryAtom, playingVideoId],
  );

  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

  // Handle like action
  const handleLike = useCallback(
    (videoId: string) => {
      setInteractions(prev => {
        const video = prev[videoId];
        const isLiked = video?.isLiked ?? false;
        const currentLikes = videos.find(v => v.id === videoId)?.likes ?? 0;

        return {
          ...prev,
          [videoId]: {
            ...video,
            isLiked: !isLiked,
            likes: isLiked ? currentLikes - 1 : currentLikes + 1,
          },
        };
      });
    },
    [videos, setInteractions],
  );

  // Handle follow action
  const handleFollow = useCallback(
    (author: string) => {
      // Update all videos by this author
      setInteractions(prev => {
        const updated = {...prev};
        videos.forEach(video => {
          if (video.author === author) {
            updated[video.id] = {
              ...updated[video.id],
              isFollowing: !(updated[video.id]?.isFollowing ?? false),
            };
          }
        });
        return updated;
      });
    },
    [videos, setInteractions],
  );

  // Render individual video card
  const renderItem = useCallback(
    ({item, index}: {item: VideoItem; index: number}) => {
      const videoInteraction = interactions[item.id] ?? {};
      const videoWithInteraction = {
        ...item,
        ...videoInteraction,
        likes: videoInteraction.likes ?? item.likes,
      };

      // Get initial progress for this video
      const initialProgress = getVideoProgress(videoProgress, item.id);

      // Only play if this video is manually started and is the active video
      const shouldPlay = index === activeIndex && 
                        isScreenFocused && 
                        playingVideoId === item.id;

      return (
        <VideoCard
          video={videoWithInteraction}
          isPlaying={shouldPlay}
          initialProgress={initialProgress}
          onLike={handleLike}
          onFollow={handleFollow}
          onPlayPress={() => {
            // When user presses play, set this video as playing
            if (index === activeIndex) {
              setPlayingVideoId(item.id);
            }
          }}
          onPausePress={() => {
            // When user pauses, clear playing video
            setPlayingVideoId(null);
          }}
        />
      );
    },
    [
      activeIndex,
      interactions,
      handleLike,
      handleFollow,
      isScreenFocused,
      videoProgress,
      playingVideoId,
    ],
  );

  // Get item layout for performance optimization
  const getItemLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: WINDOW_HEIGHT,
      offset: WINDOW_HEIGHT * index,
      index,
    }),
    [],
  );

  // Key extractor
  const keyExtractor = useCallback((item: VideoItem) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled={true}
        scrollEnabled={videos.length > 1}
        showsVerticalScrollIndicator={false}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        getItemLayout={getItemLayout}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.5}
        onScrollToIndexFailed={() => {
          // Handle scroll to index failure gracefully
        }}
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

export default VideoFeed;

