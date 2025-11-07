import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAtom} from 'jotai';
import {VideoItem} from '../data/videoData';
import {theme} from '../theme';
import {
  watchlistAtom,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlistAtom,
} from '../store/watchlistAtoms';
import {
  videoProgressAtom,
  updateVideoProgress,
} from '../store/videoProgressAtoms';
import {DramaItem} from '../data/dummyData';

const {height: WINDOW_HEIGHT, width: WINDOW_WIDTH} = Dimensions.get('window');

interface VideoCardProps {
  video: VideoItem;
  isPlaying: boolean;
  initialProgress?: number; // Time in seconds to resume from
  onLike?: (videoId: string) => void;
  onFollow?: (author: string) => void;
  dramaItem?: DramaItem; // Drama item for watchlist
}

function VideoCard({
  video,
  isPlaying,
  initialProgress = 0,
  onLike,
  onFollow,
  dramaItem,
}: VideoCardProps) {
  const [paused, setPaused] = useState(!isPlaying);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSideButtons, setShowSideButtons] = useState(false);
  const [hasSeeked, setHasSeeked] = useState(false);
  // Use safe area insets with fallback
  const safeAreaInsets = useSafeAreaInsets();
  const insets = safeAreaInsets || {top: 0, bottom: 0, left: 0, right: 0};
  const videoRef = useRef<any>(null);
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const [videoProgress, setVideoProgress] = useAtom(videoProgressAtom);
  const isInWatchlist = useAtom(isInWatchlistAtom)[0];

  // Check if drama is in watchlist
  const isSaved = dramaItem ? isInWatchlist(dramaItem.id) : false;

  // Sync paused state with isPlaying prop
  useEffect(() => {
    setPaused(!isPlaying);
  }, [isPlaying]);

  // Auto-hide side buttons after 3 seconds when video starts playing
  useEffect(() => {
    if (isPlaying && !paused) {
      // Show buttons immediately when video starts
      setShowSideButtons(true);
      
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setShowSideButtons(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, paused]);

  // Resume from last position when video loads
  useEffect(() => {
    if (
      initialProgress > 0 &&
      videoRef.current &&
      !hasSeeked &&
      !isLoading &&
      !hasError
    ) {
      // Small delay to ensure video is ready for seeking
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.seek(initialProgress);
          setHasSeeked(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialProgress, isLoading, hasSeeked, hasError]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls && isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls, isPlaying]);

  // Save progress when video is paused or component unmounts
  useEffect(() => {
    const currentRef = videoRef.current;
    return () => {
      // Save progress on unmount
      if (currentRef && !paused) {
        // Progress will be saved via onProgress callback
      }
    };
  }, [paused]);

  const handleLike = () => {
    if (onLike) {
      onLike(video.id);
    }
  };

  const handleFollow = async () => {
    if (dramaItem) {
      const isCurrentlySaved = isInWatchlist(dramaItem.id);
      if (isCurrentlySaved) {
        // Remove from watchlist
        const updated = await removeFromWatchlist(watchlist, dramaItem.id);
        setWatchlist(updated);
      } else {
        // Add to watchlist
        const updated = await addToWatchlist(watchlist, dramaItem);
        setWatchlist(updated);
      }
    }
    if (onFollow) {
      onFollow(video.author);
    }
  };

  const handleProgress = (data: {currentTime: number; playableDuration: number}) => {
    if (data.playableDuration > 0) {
      // Save progress periodically (every 5 seconds)
      if (Math.floor(data.currentTime) % 5 === 0) {
        updateVideoProgress(
          videoProgress,
          video.id,
          data.currentTime,
          data.playableDuration,
        ).then(updated => {
          setVideoProgress(updated);
        });
      }
    }
  };


  const togglePlayPause = () => {
    setPaused(!paused);
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container}>
      {/* Full-screen video player or thumbnail fallback */}
      {!hasError ? (
        <Video
          ref={videoRef}
          source={video.videoSource as any}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          repeat={true}
          paused={paused}
          muted={isMuted}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="obey"
          progressUpdateInterval={1000}
          onLoadStart={() => {
            setIsLoading(true);
            setHasError(false);
          }}
          onLoad={() => {
            setIsLoading(false);
            console.log('Video loaded');
          }}
          onProgress={handleProgress}
          onError={(error: any) => {
            console.error('Video error:', error);
            setHasError(true);
            setIsLoading(false);
          }}
          onBuffer={(data: any) => {
            // Handle buffering
            if (data.isBuffering) {
              setIsLoading(true);
            } else {
              setIsLoading(false);
            }
          }}
        />
      ) : (
        <Image
          source={video.thumbnail}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && !hasError && (
        <View style={styles.loadingContainer}>
          <Icon name="play-circle-outline" size={60} color={theme.colors.blue.primary} />
        </View>
      )}

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Top section - Author info */}
        <View style={styles.topSection}>
          {/* <View style={styles.authorInfo}>
            <Text style={styles.authorText}>{video.author}</Text>
            <Text style={styles.titleText}>{video.title}</Text>
          </View> */}
        </View>

        {/* Right side - Interaction buttons (shown for 3 seconds when video starts) */}
        {showSideButtons && (
          <View style={[styles.interactionButtons, {bottom: Math.max(insets.bottom + theme.spacing.xl + 120, theme.spacing['2xl'] + 120)}]}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLike}
              activeOpacity={0.7}>
              <Icon
                name={video.isLiked ? 'heart' : 'heart-outline'}
                size={32}
                color={video.isLiked ? theme.colors.status.error : theme.colors.text.primary}
              />
              <Text style={styles.buttonText}>{video.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Icon
                name="list-outline"
                size={32}
                color={theme.colors.text.primary}
              />
              <Text style={styles.buttonText}>Episodes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleFollow}
              activeOpacity={0.7}>
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={32}
                color={isSaved ? theme.colors.blue.primary : theme.colors.text.primary}
              />
              <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Center - Play/Pause button (shown when paused or controls visible) */}
        {(paused || showControls) && (
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={togglePlayPause}
            activeOpacity={0.8}>
            <View style={styles.playPauseIconContainer}>
              <Icon
                name={paused ? 'play' : 'pause'}
                size={60}
                color={theme.colors.text.primary}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Bottom section - Description with gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          style={styles.bottomGradient}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {video.description}
            </Text>
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>{video.duration}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Mute button (top right) */}
        <TouchableOpacity
          style={styles.muteButton}
          onPress={toggleMute}
          activeOpacity={0.7}>
          <Icon
            name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  authorInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  authorText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  titleText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
  },
  followButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.blue.primary,
    backgroundColor: 'transparent',
  },
  followingButton: {
    borderColor: theme.colors.text.tertiary,
    backgroundColor: theme.colors.background.elevated,
  },
  followButtonText: {
    color: theme.colors.blue.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  followingButtonText: {
    color: theme.colors.text.secondary,
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactionButtons: {
    position: 'absolute',
    right: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  playPauseButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -30,
  },
  playPauseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomGradient: {
    paddingBottom: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  descriptionContainer: {
    maxWidth: WINDOW_WIDTH * 0.7,
  },
  descriptionText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
  },
  muteButton: {
    position: 'absolute',
    top: theme.spacing['3xl'],
    right: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
});

export default VideoCard;

