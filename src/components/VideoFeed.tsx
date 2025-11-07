import React, {useRef, useState, useCallback, useEffect} from 'react';
import {View, FlatList, StyleSheet, Dimensions, ViewToken} from 'react-native';
import {useAtom} from 'jotai';
import VideoCard from './VideoCard';
import {VideoItem} from '../data/videoData';
import {theme} from '../theme';
import {videoInteractionsAtom} from '../store/videoAtoms';
import {videoProgressAtom, getVideoProgress} from '../store/videoProgressAtoms';
import {getEpisodesForDrama} from '../data/videoData';
import {DramaItem} from '../data/dummyData';
import {trendingDramas, latestReleases, forYouDramas} from '../data/dummyData';

const {height: WINDOW_HEIGHT} = Dimensions.get('window');

interface VideoFeedProps {
  videos: VideoItem[];
  onVideoEnd?: (videoId: string) => void;
  isScreenFocused?: boolean;
  initialDramaId?: string; // Filter videos for specific drama
}

function VideoFeed({
  videos,
  onVideoEnd: _onVideoEnd,
  isScreenFocused = true,
  initialDramaId,
}: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [interactions, setInteractions] = useAtom(videoInteractionsAtom);
  const [videoProgress] = useAtom(videoProgressAtom);

  // Filter videos by dramaId if provided
  const filteredVideos = initialDramaId
    ? getEpisodesForDrama(videos, initialDramaId)
    : videos;

  // Get drama item for watchlist functionality
  const getDramaItem = (dramaId: string): DramaItem | undefined => {
    const allDramas = [...trendingDramas, ...latestReleases, ...forYouDramas];
    return allDramas.find(drama => drama.id === dramaId);
  };

  // Auto-scroll to first video when dramaId is provided
  useEffect(() => {
    if (initialDramaId && filteredVideos.length > 0 && flatListRef.current) {
      // Small delay to ensure FlatList is rendered
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({index: 0, animated: false});
      }, 100);
    }
  }, [initialDramaId, filteredVideos.length]);

  // Viewability configuration for detecting visible items
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Consider item visible if 50% is on screen
    minimumViewTime: 300, // Item must be visible for at least 300ms
  }).current;

  // Handle when viewable items change
  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        const newActiveIndex = viewableItems[0].index ?? 0;
        if (newActiveIndex !== activeIndex) {
          setActiveIndex(newActiveIndex);
        }
      }
    },
    [activeIndex],
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

      // Get drama item for watchlist
      const dramaItem = getDramaItem(item.dramaId);

      return (
        <VideoCard
          video={videoWithInteraction}
          isPlaying={index === activeIndex && isScreenFocused}
          initialProgress={initialProgress}
          onLike={handleLike}
          onFollow={handleFollow}
          dramaItem={dramaItem}
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
        data={filteredVideos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled={true}
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

