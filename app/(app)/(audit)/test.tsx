import React, { useState, useCallback, useRef, memo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import { Address, schema } from '~/db';
import { useDb } from '~/db/useDb';

const PAGE_SIZE = 10;
const TOTAL_ITEMS = 100;
const PAGE_WINDOW_SIZE = 5; // Number of pages to keep in memory (current page +/- 2)

const AddressItem = memo(({ item, loading }: { item: Address | null; loading: boolean }) => {
  if (loading) {
    return (
      <View style={styles.addressItem}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.addressItem}>
      {item ? (
        <>
          <Text style={styles.addressName}>{item.address_name || 'Unnamed Address'}</Text>
          <Text>{item.address_line_1}</Text>
          {item.address_line_2 && <Text>{item.address_line_2}</Text>}
          <Text>{`${item.city || ''}, ${item.post_code || ''}`}</Text>
          <Text>{item.country || ''}</Text>
        </>
      ) : (
        <Text>No data found</Text>
      )}
    </View>
  );
});

export const Customers = () => {
  const db = useDb();
  const [pages, setPages] = useState<{ [key: number]: (Address | null)[] }>({});
  const loadingPages = useRef(new Set<number>()).current;
  // Track the current visible page range to manage the sliding window
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate which pages should be kept in memory
  const getPagesToKeep = useCallback((centerPage: number) => {
    const pagesToKeep = new Set<number>();
    // Keep pages within the window range
    for (
      let i = centerPage - Math.floor(PAGE_WINDOW_SIZE / 2);
      i <= centerPage + Math.floor(PAGE_WINDOW_SIZE / 2);
      i++
    ) {
      if (i >= 0 && i < Math.ceil(TOTAL_ITEMS / PAGE_SIZE)) {
        pagesToKeep.add(i);
      }
    }
    return pagesToKeep;
  }, []);

  // Clean up pages outside the window
  const cleanupPages = useCallback(
    (centerPage: number) => {
      const pagesToKeep = getPagesToKeep(centerPage);

      setPages((prev) => {
        const newPages = { ...prev };
        // Remove pages outside the window
        Object.keys(newPages).forEach((pageKey) => {
          const pageNum = parseInt(pageKey, 10);
          if (!pagesToKeep.has(pageNum)) {
            delete newPages[pageNum];
          }
        });
        return newPages;
      });
    },
    [getPagesToKeep]
  );

  const fetchPage = useCallback(
    async (page: number) => {
      if (loadingPages.has(page)) return;
      loadingPages.add(page);

      try {
        const results = await db
          .select()
          .from(schema.addresses)
          .limit(PAGE_SIZE)
          .offset(page * PAGE_SIZE)
          .orderBy(schema.addresses.section_index, schema.addresses.address_name);

        const pageItems = results.slice(0, PAGE_SIZE);

        setPages((prev) => {
          const newPages = { ...prev, [page]: pageItems };
          return newPages;
        });

        // Update current page and clean up if needed
        setCurrentPage((currentPage) => {
          // Only clean up if we're not in the process of rapidly scrolling
          // (prevents too frequent cleanups during fast scrolling)
          if (Math.abs(page - currentPage) <= 2) {
            cleanupPages(page);
          }
          return page;
        });
      } catch (err) {
        console.error(`Error fetching page ${page}:`, err);
        setPages((prev) => ({ ...prev, [page]: Array(PAGE_SIZE).fill(null) }));
      } finally {
        loadingPages.delete(page);
      }
    },
    [db, loadingPages, cleanupPages]
  );

  const getItem = useCallback(
    (_: unknown, index: number) => {
      const page = Math.floor(index / PAGE_SIZE);
      console.log('📖 Accessing item', index, '(Page', page, ')');
      if (!pages[page] && !loadingPages.has(page)) {
        fetchPage(page);
      }
      return index;
    },
    [pages, fetchPage, loadingPages]
  );

  const renderItem = useCallback(
    ({ item: index }: { item: number }) => {
      const page = Math.floor(index / PAGE_SIZE);
      const position = index % PAGE_SIZE;
      const pageData = pages[page];
      const isLoading = !pageData && loadingPages.has(page);

      return <AddressItem item={pageData?.[position]} loading={isLoading} />;
    },
    [pages, loadingPages]
  );

  // Update current page when visible items change
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        // Find the middle visible item
        const middleIndex = viewableItems[Math.floor(viewableItems.length / 2)]?.index || 0;
        const page = Math.floor(middleIndex / PAGE_SIZE);

        if (page !== currentPage) {
          setCurrentPage(page);
          // Only clean up pages when scrolling has somewhat settled
          // This helps prevent excessive state updates during rapid scrolling
          setTimeout(() => cleanupPages(page), 300);
        }
      }
    },
    [currentPage, cleanupPages]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200,
  }).current;

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged: handleViewableItemsChanged },
  ]).current;

  return (
    <SafeAreaView style={styles.container}>
      <VirtualizedList
        getItemCount={() => TOTAL_ITEMS}
        getItem={getItem}
        keyExtractor={(index) => String(index)}
        renderItem={renderItem}
        initialNumToRender={10}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        debug
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addressItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 8,
  },
});

export default Customers;
