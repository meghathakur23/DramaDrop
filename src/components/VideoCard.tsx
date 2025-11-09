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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const progressBarWidthRef = useRef(0);
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

  // Handle video tap to show/hide side buttons
  const handleVideoTap = () => {
    setShowSideButtons(prev => !prev);
    setShowControls(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSideButtons(false);
      setShowControls(false);
    }, 3000);
  };

  // Initialize duration from saved progress if available
  useEffect(() => {
    const savedProgress = videoProgress[video.id];
    if (savedProgress && savedProgress.duration > 0) {
      setDuration(savedProgress.duration);
      setCurrentTime(savedProgress.currentTime || 0);
    }
  }, [video.id, videoProgress]);

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

  const handleProgress = (data: {currentTime: number; playableDuration: number; seekableDuration?: number}) => {
    // Only update currentTime, don't overwrite duration with playableDuration
    setCurrentTime(data.currentTime);
    
    // Only set duration if it's not already set and we have a valid duration value
    // Use seekableDuration if available (more accurate), otherwise keep existing duration
    if (duration === 0 && data.seekableDuration && data.seekableDuration > 0) {
      setDuration(data.seekableDuration);
    }
    
    const currentTime = Math.floor(data.currentTime);
    const lastSaved = Math.floor(lastSavedTimeRef.current);
    
    // Save progress every 3 seconds or when significant time has passed
    if (currentTime !== lastSaved && (currentTime % 3 === 0 || currentTime - lastSaved >= 3)) {
      // Clear any pending save
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }
      
      // Debounce save by 500ms to avoid excessive writes
      // Use current duration state (from onLoad) instead of playableDuration
      saveProgressTimeoutRef.current = setTimeout(() => {
        updateVideoProgress(
          videoProgress,
          video.id,
          data.currentTime,
          duration > 0 ? duration : data.playableDuration, // Fallback to playableDuration only if duration not set
        ).then(updated => {
          setVideoProgress(updated);
          lastSavedTimeRef.current = data.currentTime;
        }).catch(error => {
          console.error('Error saving video progress:', error);
        });
      }, 500);
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

  // Cycle through playback speeds: 0.5x → 1x → 1.5x → 2x → 0.5x
  const togglePlaybackSpeed = () => {
    const speeds = [0.5, 1.0, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  // Format time in seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle seek when user taps progress bar
  const handleSeek = (seekTime: number) => {
    if (videoRef.current && duration > 0) {
      const clampedTime = Math.max(0, Math.min(seekTime, duration));
      videoRef.current.seek(clampedTime);
      // onSeek callback will update currentTime, but set it immediately for UI responsiveness
      setCurrentTime(clampedTime);
    }
  };

  // Handle progress bar press - improved accuracy
  const handleProgressPress = (evt: any) => {
    if (progressBarWidthRef.current > 0 && duration > 0) {
      const touchX = evt.nativeEvent.locationX;
      // Ensure we're using the correct duration value
      const percentage = Math.max(0, Math.min(1, touchX / progressBarWidthRef.current));
      const seekTime = percentage * duration;
      // Only seek if we have a valid duration
      if (duration > 0 && seekTime >= 0 && seekTime <= duration) {
        handleSeek(seekTime);
      }
    }
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
            rate={playbackRate}
            controls={false}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="obey"
            progressUpdateInterval={100}
            onLoadStart={() => {
              setIsLoading(true);
              setHasError(false);
            }}
            onLoad={(data: any) => {
              setIsLoading(false);
              // Set duration from onLoad - this is the actual video duration
              if (data.duration && data.duration > 0) {
                setDuration(data.duration);
                console.log('Video loaded, duration:', data.duration);
              } else if (data.seekableDuration && data.seekableDuration > 0) {
                // Fallback to seekableDuration if duration is not available
                setDuration(data.seekableDuration);
                console.log('Video loaded, seekableDuration:', data.seekableDuration);
              }
            }}
            onProgress={handleProgress}
            onSeek={(data: any) => {
              setCurrentTime(data.currentTime);
            }}
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
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleVideoTap}>
        {/* Top section - Back button and Title (shown when video is tapped) */}
        {showSideButtons && (
          <View style={[styles.topSection, {paddingTop: insets.top + theme.spacing.md}]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.goBack();
              }}
              activeOpacity={0.7}>
              <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {video.title}
            </Text>
          </View>
        )}

        {/* Right side - Interaction buttons (shown when video is tapped) */}
        {showSideButtons && (
          <View style={[styles.interactionButtons, {bottom: Math.max(insets.bottom + theme.spacing.xl + 120, theme.spacing['2xl'] + 120)}]}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                handleLike();
              }}
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
              onPress={(e) => {
                e.stopPropagation();
                handleFollow();
              }}
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
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            activeOpacity={0.8}>
            <View style={styles.playPauseIconContainer}>
              <Icon
                name={paused ? 'play' : 'pause'}
                size={40}
                color={theme.colors.text.primary}
              />
            </View>
          </TouchableOpacity>
        )}


        {/* Mute button (top right) */}
        <TouchableOpacity
          style={styles.muteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          activeOpacity={0.7}>
          <Icon
            name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        {/* Bottom Controls Bar - Seekbar Only (shown when video is tapped) */}
        {showSideButtons && duration > 0 && (
          <View style={[styles.bottomControls, {paddingBottom: insets.bottom + theme.spacing.md}]}>
            {/* Seekbar Only - Using react-native-video's seek functionality */}
            <View style={styles.progressBarWrapper}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)}
              </Text>
              <TouchableOpacity
                style={styles.progressBarTrack}
                activeOpacity={1}
                onLayout={(e) => {
                  progressBarWidthRef.current = e.nativeEvent.layout.width;
                }}
                onPress={handleProgressPress}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${
                          duration > 0 ? (currentTime / duration) * 100 : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  videoTitle: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    zIndex: 10,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  timeText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    minWidth: 45,
  },
  progressBarTrack: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.blue.primary,
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  speedButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  speedButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default VideoCard;

