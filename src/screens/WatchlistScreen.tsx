import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAtom} from 'jotai';
import {theme} from '../theme';
import DramaCard from '../components/DramaCard';
import {DramaItem} from '../data/dummyData';
import {
  watchlistAtom,
  removeFromWatchlist,
  initializeWatchlist,
} from '../store/watchlistAtoms';

function WatchlistScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize watchlist on mount
  useEffect(() => {
    const initWatchlist = async () => {
      const watchlistData = await initializeWatchlist();
      setWatchlist(watchlistData);
      setIsLoading(false);
    };
    initWatchlist();
  }, [setWatchlist]);

  const handleDramaPress = (item: DramaItem) => {
    // Navigate to ForYou screen with dramaId
    (navigation as any).navigate('ForYou', {dramaId: item.id});
  };

  const handleDramaSave = async (item: DramaItem) => {
    // Remove from watchlist
    const updated = await removeFromWatchlist(watchlist, item.id);
    setWatchlist(updated);
  };

  const handleRemove = async (item: DramaItem) => {
    const updated = await removeFromWatchlist(watchlist, item.id);
    setWatchlist(updated);
  };

  const renderItem = ({item}: {item: DramaItem}) => (
    <View style={styles.cardWrapper}>
      <DramaCard
        item={item}
        onPress={() => handleDramaPress(item)}
        onSavePress={handleDramaSave}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item)}
        activeOpacity={0.7}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Saved Dramas</Text>
      <Text style={styles.emptySubtitle}>
        Start saving your favorite dramas to watch them later
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlist</Text>
        <Text style={styles.subtitle}>
          {watchlist.length} {watchlist.length === 1 ? 'drama' : 'dramas'} saved
        </Text>
      </View>
      {watchlist.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={watchlist}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.listContent,
            {paddingBottom: 60 + insets.bottom + theme.spacing.xl},
          ]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  removeButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
});

export default WatchlistScreen;

