import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAtom, useSetAtom} from 'jotai';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';
import {
  watchHistoryAtom,
  initializeWatchHistory,
  removeFromHistory,
  WatchHistoryItem,
} from '../store/watchHistoryAtoms';
import {videoProgressAtom, VideoProgress} from '../store/videoProgressAtoms';
import {allVideos} from '../data/videoData';

function HistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [history] = useAtom(watchHistoryAtom);
  const setHistoryAtom = useSetAtom(watchHistoryAtom);
  const [videoProgress] = useAtom(videoProgressAtom);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Tab bar is already hidden for all profile sub-screens (handled in ProfileStackNavigator)
  // No need for additional tab bar hiding logic here

  useEffect(() => {
    const initHistory = async () => {
      const historyData = await initializeWatchHistory();
      setHistoryAtom(historyData);
    };
    initHistory();
  }, [setHistoryAtom]);

  const handleCardPress = (item: WatchHistoryItem) => {
    if (selectedItems.size > 0) {
      // In selection mode, do nothing on card press (only radio button works)
      return;
    }
    // Navigate to video
    (navigation as any).navigate('VideoPlayer', {videoId: item.videoId});
  };

  const handleRadioPress = (videoId: string, e: any) => {
    e.stopPropagation();
    toggleSelection(videoId);
  };

  const toggleSelection = (videoId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleRemoveSelected = () => {
    if (selectedItems.size === 0) return;
    setShowConfirmModal(true);
  };

  const confirmRemove = async () => {
    setShowConfirmModal(false);
    let updatedHistory = [...history];
    for (const videoId of selectedItems) {
      updatedHistory = await removeFromHistory(updatedHistory, videoId);
    }
    setHistoryAtom(updatedHistory);
    setSelectedItems(new Set());
  };

  const cancelRemove = () => {
    setShowConfirmModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Watched today';
    } else if (diffDays === 1) {
      return 'Watched yesterday';
    } else if (diffDays < 7) {
      return `Watched ${diffDays} days ago`;
    } else {
      return `Watched ${date.toLocaleDateString()}`;
    }
  };

  const getProgressData = (item: WatchHistoryItem): {progress: number; duration: number; hasProgress: boolean} => {
    // First check videoProgress atom (this is the source of truth)
    const progressData = videoProgress[item.videoId] as VideoProgress | undefined;
    if (progressData && progressData.duration > 0) {
      const progress = progressData.currentTime || 0;
      const duration = progressData.duration;
      // Show progress if there's any watch time and not completed (>95%)
      const hasProgress = progress > 0 && progress < duration * 0.95;
      if (hasProgress) {
        return {progress, duration, hasProgress: true};
      }
    }
    
    // Fallback: check if item has progress stored directly in history
    if (item.progress !== undefined && item.progress > 0) {
      // Estimate duration from video data if available
      const video = allVideos.find(v => v.id === item.videoId);
      let estimatedDuration = 0;
      if (video?.duration) {
        const durationStr = video.duration;
        // Parse duration like "39m" or "3m 20s"
        const minutesMatch = durationStr.match(/(\d+)m/);
        const secondsMatch = durationStr.match(/(\d+)s/);
        if (minutesMatch) estimatedDuration += parseInt(minutesMatch[1], 10) * 60;
        if (secondsMatch) estimatedDuration += parseInt(secondsMatch[1], 10);
      }
      if (estimatedDuration > 0) {
        const hasProgress = item.progress < estimatedDuration * 0.95;
        if (hasProgress) {
          return {progress: item.progress, duration: estimatedDuration, hasProgress: true};
        }
      }
    }
    
    // Don't show default progress - only show if there's actual progress data
    return {progress: 0, duration: 0, hasProgress: false};
  };

  const formatTimeLeft = (progress: number, duration: number): string => {
    const remaining = duration - progress;
    const minutes = Math.floor(remaining / 60);
    return `${minutes}m left`;
  };

  const getGenre = (): string => {
    // Default genre - can be enhanced later
    return 'Drama';
  };

  const isSelectionMode = selectedItems.size > 0;
  const bottomPadding = isSelectionMode 
    ? 80 + insets.bottom 
    : 60 + insets.bottom + theme.spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Watch History</Text>
          <Text style={styles.headerSubtitle}>Resume what you started</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      {history.length === 0 ? (
        <View style={styles.emptyContent}>
          <Icon name="time-outline" size={64} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No watch history yet</Text>
          <Text style={styles.emptySubtext}>Your watched videos will appear here</Text>
        </View>
      ) : (
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, {paddingBottom: bottomPadding}]}
            showsVerticalScrollIndicator={false}>
            {history.map((item) => {
              const {progress, duration, hasProgress} = getProgressData(item);
              const isSelected = selectedItems.has(item.videoId);
              const video = allVideos.find(v => v.id === item.videoId);
              const thumbnail = video?.thumbnail;
              const progressPercentage = duration > 0 && progress > 0 ? Math.min(Math.max((progress / duration) * 100, 1), 100) : 0;
              const genre = getGenre();

              if (!thumbnail) return null;

              return (
                <View key={item.videoId} style={styles.cardRow}>
                  {/* Radio Button - Outside card, left side */}
                  {isSelectionMode && (
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={(e) => handleRadioPress(item.videoId, e)}
                      activeOpacity={0.7}>
                      <Icon
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={24}
                        color={isSelected ? theme.colors.blue.primary : theme.colors.text.secondary}
                      />
                    </TouchableOpacity>
                  )}

                  {/* Card */}
                  <TouchableOpacity
                    style={styles.historyCard}
                    onPress={() => handleCardPress(item)}
                    activeOpacity={0.8}>
                    <Image source={thumbnail} style={styles.thumbnail} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historyTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.historyDetails}>
                        {hasProgress
                          ? `${formatTimeLeft(progress, duration)} • ${genre}`
                          : `${formatDate(item.watchedAt)} • ${genre}`}
                      </Text>
                      {hasProgress && duration > 0 && (
                        <View style={styles.progressBarContainer}>
                          <View style={styles.progressBarBackground}>
                            <LinearGradient
                              colors={[theme.colors.blue.primary, theme.colors.pink.primary]}
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              style={[styles.progressBarFill, {width: `${Math.max(progressPercentage, 2)}%`}]}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => handleCardPress(item)}
                      activeOpacity={0.7}>
                      <Icon
                        name={hasProgress ? 'play' : 'refresh'}
                        size={20}
                        color={theme.colors.text.primary}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          {isSelectionMode && (
            <View style={[styles.bottomActionBar, {paddingBottom: Math.max(insets.bottom, theme.spacing.md)}]}>
              <Text style={styles.selectedCount}>
                {selectedItems.size} selected
              </Text>
              <TouchableOpacity
                onPress={handleRemoveSelected}
                activeOpacity={0.8}
                style={styles.removeButtonBottom}>
                <LinearGradient
                  colors={[theme.colors.pink.primary, theme.colors.purple.primary]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.removeButtonGradient}>
                  <Icon name="trash-outline" size={20} color={theme.colors.text.primary} />
                  <Text style={[styles.removeButtonText, {marginLeft: theme.spacing.sm}]}>Remove</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelRemove}>
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#1A1A1A', '#0A0A0A', '#1A1A1A']}
            style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <LinearGradient
                  colors={[theme.colors.pink.primary, theme.colors.purple.primary]}
                  style={styles.modalIconGradient}>
                  <Icon name="warning" size={32} color={theme.colors.text.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.modalTitle}>Remove Items?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to remove {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} from history?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={cancelRemove}
                  activeOpacity={0.8}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={confirmRemove}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={[theme.colors.pink.primary, theme.colors.purple.primary]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.modalConfirmGradient}>
                    <Text style={styles.modalConfirmText}>Remove</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.base,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  radioButtonContainer: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  historyCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  historyDetails: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  progressBarContainer: {
    marginTop: theme.spacing.xs,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    zIndex: 10,
  },
  selectedCount: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  removeButtonBottom: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  removeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  removeButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalIconGradient: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  modalCancelText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginLeft: theme.spacing.sm,
  },
  modalConfirmGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});

export default HistoryScreen;
