import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';
import {DramaItem} from '../data/dummyData';

interface DramaCardProps {
  item: DramaItem;
  showPlayIcon?: boolean;
  showAddIcon?: boolean;
  onPress?: () => void;
}

function DramaCard({item, showPlayIcon = false, showAddIcon = false, onPress}: DramaCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        
        {/* Episode Info Badge */}
        {item.episodeInfo && (
          <View style={styles.episodeBadge}>
            <Text style={styles.episodeText}>{item.episodeInfo}</Text>
          </View>
        )}

        {/* Match Percentage Badge */}
        {item.matchPercentage !== undefined && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>Match {item.matchPercentage}%</Text>
          </View>
        )}

        {/* Play Icon Overlay */}
        {showPlayIcon && (
          <View style={styles.playIconContainer}>
            <View style={styles.playIconBackground}>
              <Icon name="play" size={20} color={theme.colors.text.primary} />
            </View>
          </View>
        )}

        {/* Add Icon Overlay */}
        {showAddIcon && (
          <View style={styles.addIconContainer}>
            <View style={styles.addIconBackground}>
              <Icon name="add" size={20} color={theme.colors.text.primary} />
            </View>
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
    width: 140,
    marginRight: theme.spacing.base,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  episodeBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.purple.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  episodeText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  matchBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.purple.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  matchText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  playIconContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  playIconBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: theme.borderRadius.full,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  addIconBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: theme.borderRadius.full,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
});

export default DramaCard;

