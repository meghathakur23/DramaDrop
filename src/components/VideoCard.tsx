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
import {useNavigation} from '@react-navigation/native';
import {useAtom, useAtomValue} from 'jotai';
import {VideoItem} from '../data/videoData';
import {theme} from '../theme';
import {
  videoProgressAtom,
  updateVideoProgress,
} from '../store/videoProgressAtoms';
import {resolveVideoSource} from '../utils/videoSourceResolver';
import {isPremiumAtom} from '../store/subscriptionAtoms';

const {height: WINDOW_HEIGHT, width: WINDOW_WIDTH} = Dimensions.get('window');
// Calculate 9:16 portrait aspect ratio dimensions
// For 9:16 ratio: width:height = 9:16, so width = height * (9/16)
const VIDEO_WIDTH = WINDOW_HEIGHT * (9 / 16);
const VIDEO_HORIZONTAL_MARGIN = (WINDOW_WIDTH - VIDEO_WIDTH) / 2;

interface VideoCardProps {
  video: VideoItem;
  isPlaying: boolean;
  initialProgress?: number; // Time in seconds to resume from
  onLike?: (videoId: string) => void;
  onFollow?: (author: string) => void;
  onPlayPress?: () => void;
  onPausePress?: () => void;
}

function VideoCard({
  video,
  isPlaying,
  initialProgress = 0,
  onLike,
  onFollow,
  onPlayPress,
  onPausePress,
}: VideoCardProps) {
  // Videos start paused by default - only play when explicitly started
  const [paused, setPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSideButtons, setShowSideButtons] = useState(false);
  const [hasSeeked, setHasSeeked] = useState(false);
  // Use safe area insets with fallback
  const safeAreaInsets = useSafeAreaInsets();
  const navigation = useNavigation();
  const insets = safeAreaInsets || {top: 0, bottom: 0, left: 0, right: 0};
  const videoRef = useRef<any>(null);
  const [videoProgress, setVideoProgress] = useAtom(videoProgressAtom);
  const isPremium = useAtomValue(isPremiumAtom);
  const isPremiumContent = video.isPremium === true;

  // Sync paused state with isPlaying prop and handle premium gating
  useEffect(() => {
    if (isPremiumContent && !isPremium) {
      // Pause premium content if user doesn't have premium access
      setPaused(true);
    } else {
      // Only play if isPlaying is true (manually started)
      setPaused(!isPlaying);
    }
  }, [isPlaying, isPremiumContent, isPremium]);

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

  // Save progress when video is paused, unmounts, or app goes to background
  useEffect(() => {
    const currentRef = videoRef.current;
    
    // Save progress when paused
    if (paused && currentRef) {
      // Get current time from video ref if possible
      const saveFinalProgress = async () => {
        try {
          // Try to get current time from video (if available)
          // For now, we'll rely on the last saved progress from onProgress
          // The progress should already be saved via handleProgress
        } catch (error) {
          console.error('Error saving final progress:', error);
        }
      };
      saveFinalProgress();
    }
    
    return () => {
      // Save progress on unmount - clear timeout and save immediately
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }
      
      // Force save current progress on unmount
      if (currentRef && videoProgress[video.id]) {
        const currentProgress = videoProgress[video.id];
        updateVideoProgress(
          videoProgress,
          video.id,
          currentProgress.currentTime,
          currentProgress.duration,
        ).catch(error => {
          console.error('Error saving progress on unmount:', error);
        });
      }
    };
  }, [paused, video.id, videoProgress]);

  const handleLike = () => {
    if (onLike) {
      onLike(video.id);
    }
  };

  const handleFollow = () => {
    if (onFollow) {
      onFollow(video.author);
    }
  };

  // Use ref to track last saved time to avoid excessive saves
  const lastSavedTimeRef = useRef<number>(0);
  const saveProgressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleProgress = (data: {currentTime: number; playableDuration: number}) => {
    if (data.playableDuration > 0) {
      const currentTime = Math.floor(data.currentTime);
      const lastSaved = Math.floor(lastSavedTimeRef.current);
      
      // Save progress every 3 seconds or when significant time has passed
      if (currentTime !== lastSaved && (currentTime % 3 === 0 || currentTime - lastSaved >= 3)) {
        // Clear any pending save
        if (saveProgressTimeoutRef.current) {
          clearTimeout(saveProgressTimeoutRef.current);
        }
        
        // Debounce save by 500ms to avoid excessive writes
        saveProgressTimeoutRef.current = setTimeout(() => {
          updateVideoProgress(
            videoProgress,
            video.id,
            data.currentTime,
            data.playableDuration,
          ).then(updated => {
            setVideoProgress(updated);
            lastSavedTimeRef.current = data.currentTime;
          }).catch(error => {
            console.error('Error saving video progress:', error);
          });
        }, 500);
      }
    }
  };


  const togglePlayPause = () => {
    const newPausedState = !paused;
    setPaused(newPausedState);
    setShowControls(true);
    
    // Notify parent component about play/pause state
    if (newPausedState) {
      onPausePress?.();
    } else {
      onPlayPress?.();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container}>
      {/* Video container with 9:16 aspect ratio */}
      <View style={styles.videoContainer}>
        {/* Full-screen video player or thumbnail fallback */}
        {!hasError ? (
          <Video
            ref={videoRef}
            source={resolveVideoSource(video.videoSource) as any}
            style={styles.video}
            resizeMode="contain"
            repeat={false}
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
            onEnd={() => {
              // Video finished playing - allow it to complete naturally
              console.log('Video ended:', video.id);
            }}
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
          style={styles.video}
          resizeMode="contain"
        />
      )}
      </View>
      
      {/* Loading indicator */}
      {isLoading && !hasError && (
        <View style={styles.loadingContainer}>
          <Icon name="play-circle-outline" size={60} color={theme.colors.blue.primary} />
        </View>
      )}

      {/* Premium lock overlay */}
      {isPremiumContent && !isPremium && (
        <View style={styles.premiumLockOverlay}>
          <View style={styles.premiumLockContent}>
            <Icon name="lock-closed" size={60} color={theme.colors.text.primary} />
            <Text style={styles.premiumLockTitle}>Premium Content</Text>
            <Text style={styles.premiumLockText}>
              Upgrade to Premium to watch this video
            </Text>
            <TouchableOpacity
              style={styles.premiumLockButton}
              onPress={() => {
                // Navigate to subscription screen
                (navigation as any).navigate('Subscription');
              }}
              activeOpacity={0.8}>
              <Text style={styles.premiumLockButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
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

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleFollow}
              activeOpacity={0.7}>
              <Icon
                name="bookmark-outline"
                size={32}
                color={theme.colors.text.primary}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: VIDEO_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: theme.colors.background.primary,
  },
  video: {
    width: '100%',
    height: '100%',
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
    position: 'absolute',
    top: 0,
    left: VIDEO_HORIZONTAL_MARGIN,
    width: VIDEO_WIDTH,
    height: WINDOW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  premiumLockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  premiumLockContent: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  premiumLockTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  premiumLockText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  premiumLockButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.blue.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  premiumLockButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});

export default VideoCard;

