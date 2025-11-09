import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useAtom} from 'jotai';
import {theme} from '../theme';
import {DramaItem} from '../data/dummyData';
import {isInWatchlistAtom} from '../store/watchlistAtoms';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const NUM_COLUMNS = 3;
const HORIZONTAL_PADDING = theme.spacing.sm * 2; // Left + right padding (reduced from base to sm)
const CARD_GAP = theme.spacing.sm; // Spacing between cards
// Calculate card width: (screen width - horizontal padding - gaps between cards) / number of columns
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING - (CARD_GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

interface DramaCardProps {
  item: DramaItem;
  showPlayIcon?: boolean;
  showAddIcon?: boolean;
  onPress?: () => void;
  onSavePress?: (item: DramaItem) => void;
}

function DramaCard({
  item,
  showPlayIcon = false,
  showAddIcon = false,
  onPress,
  onSavePress,
}: DramaCardProps) {
  const isInWatchlist = useAtom(isInWatchlistAtom)[0];
  const isSaved = isInWatchlist(item.id);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        
        {/* Members Only Badge (shown for premium content, only if not following) */}
        {item.isPremium && !isSaved && (
          <View style={styles.membersOnlyBadge}>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FFD700']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.membersOnlyGradient}>
              <Text style={styles.membersOnlyText}>Members Only</Text>
            </LinearGradient>
          </View>
        )}

        {/* Following Text Badge (shown when saved, positioned at top-right edge) */}
        {isSaved && (
          <View style={styles.followingBadge}>
            <LinearGradient
              colors={[theme.colors.blue.primary, theme.colors.pink.primary, theme.colors.purple.primary]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.followingGradient}>
              <Text style={styles.followingText}>Following</Text>
            </LinearGradient>
          </View>
        )}
      </View>
      
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP, // Add spacing between cards
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.4, // Maintain aspect ratio (approximately 1.4:1)
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs / 2, // Reduce space between image and title
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  membersOnlyBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopRightRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  membersOnlyGradient: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
  },
  membersOnlyText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.regular,
    color: '#000000',
  },
  followingBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopRightRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  followingGradient: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
  },
  followingText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.primary,
    marginTop: 0, // Remove margin top to reduce space between card and title
  },
});

export default DramaCard;

