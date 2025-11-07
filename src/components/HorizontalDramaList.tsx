import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {theme} from '../theme';
import DramaCard from './DramaCard';
import {DramaItem} from '../data/dummyData';

interface HorizontalDramaListProps {
  title: string;
  actionText: string;
  data: DramaItem[];
  onActionPress?: () => void;
  showPlayIcon?: boolean;
  showAddIcon?: boolean;
  onDramaPress?: (item: DramaItem) => void;
  onDramaSave?: (item: DramaItem) => void;
}

function HorizontalDramaList({
  title,
  actionText,
  data,
  onActionPress,
  showPlayIcon = false,
  showAddIcon = false,
  onDramaPress,
  onDramaSave,
}: HorizontalDramaListProps) {
  const renderItem = ({item}: {item: DramaItem}) => (
    <DramaCard
      item={item}
      showPlayIcon={showPlayIcon}
      showAddIcon={showAddIcon}
      onPress={() => onDramaPress?.(item)}
      onSavePress={onDramaSave}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.blue.primary,
  },
  listContent: {
    paddingLeft: theme.spacing.base,
  },
});

export default HorizontalDramaList;

