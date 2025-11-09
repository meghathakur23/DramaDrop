import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAtom, useSetAtom} from 'jotai';
import {theme} from '../theme';
import DramaCard from '../components/DramaCard';
import {
  trendingDramas,
  latestReleases,
  forYouDramas,
  DramaItem,
} from '../data/dummyData';
import {allVideos, VideoItem} from '../data/videoData';
import {
  watchlistAtom,
  addToWatchlist,
  removeFromWatchlist,
} from '../store/watchlistAtoms';

const NUM_COLUMNS = 3;

function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);

  // Combine all dramas for search
  const allDramas = useMemo(() => {
    return [...trendingDramas, ...latestReleases, ...forYouDramas];
  }, []);

  // Search function - searches through dramas and videos
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const results: DramaItem[] = [];

    // Search in dramas
    allDramas.forEach(drama => {
      if (drama.title.toLowerCase().includes(query)) {
        results.push(drama);
      }
    });

    // Search in videos (convert to DramaItem format for display)
    allVideos.forEach(video => {
      if (
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.author.toLowerCase().includes(query)
      ) {
        // Check if already in results (avoid duplicates)
        if (!results.some(d => d.id === video.id)) {
          results.push({
            id: video.id,
            title: video.title,
            image: video.thumbnail,
            isPremium: video.isPremium,
          });
        }
      }
    });

    return results;
  }, [searchQuery, allDramas]);

  const handleDramaPress = (item: DramaItem) => {
    // Find the corresponding video from allVideos
    const video = allVideos.find(v => v.id === item.id);
    
    if (video) {
      (navigation as any).navigate('VideoPlayer', {
        videoId: video.id,
        videos: [video],
      });
    } else {
      (navigation as any).navigate('VideoPlayer', {videoId: item.id});
    }
  };

  const handleDramaSave = async (item: DramaItem) => {
    const isCurrentlySaved = watchlist.some(drama => drama.id === item.id);
    if (isCurrentlySaved) {
      const updated = await removeFromWatchlist(watchlist, item.id);
      setWatchlist(updated);
    } else {
      const updated = await addToWatchlist(watchlist, item);
      setWatchlist(updated);
    }
  };

  const getDramaProps = (item: DramaItem) => {
    const isFromLatestReleases = latestReleases.some(d => d.id === item.id);
    const isFromForYou = forYouDramas.some(d => d.id === item.id);
    
    return {
      showPlayIcon: isFromLatestReleases,
      showAddIcon: isFromForYou,
    };
  };

  const renderDramaCard = ({item}: {item: DramaItem}) => {
    const {showPlayIcon, showAddIcon} = getDramaProps(item);
    return (
      <DramaCard
        item={item}
        showPlayIcon={showPlayIcon}
        showAddIcon={showAddIcon}
        onPress={() => handleDramaPress(item)}
        onSavePress={() => handleDramaSave(item)}
      />
    );
  };

  const renderEmptyState = () => {
    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="search-outline" size={64} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Icon name="search-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={styles.emptyText}>Search for dramas</Text>
        <Text style={styles.emptySubtext}>
          Enter a title, author, or description to find what you're looking for
        </Text>
      </View>
    );
  };

  const tabBarHeight = 60 + insets.bottom;
  const bottomPadding = tabBarHeight + theme.spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dramas..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.7}>
              <Icon name="close-circle" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderDramaCard}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: bottomPadding},
          searchResults.length === 0 && styles.emptyListContent,
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    marginRight: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    padding: 0,
  },
  clearButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  listContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  row: {
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
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
});

export default SearchScreen;

