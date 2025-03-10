import { count } from 'drizzle-orm';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  VirtualizedList,
  RefreshControl,
  ViewToken,
} from 'react-native';

import { Address, schema } from '~/db';
import { useDb } from '~/db/useDb';

const PAGE_SIZE = 20;
const PAGE_BUFFER = 1;

type ListItem = { index: number; page: number };

const Customers = () => {
  const db = useDb();
  const [pages, setPages] = useState<{ [key: number]: Address[] }>({});
  const [totalItems, setTotalItems] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const loadingPagesRef = useRef(new Set<number>());
  const mountedRef = useRef(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const dbCount = await db.select({ count: count() }).from(schema.addresses);
      if (mountedRef.current) {
        setTotalItems(dbCount[0]?.count || 0);
      }
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  }, [db]);

  // 2) Load a page if not already in memory or currently loading
  const loadPage = useCallback(
    async (page: number) => {
      if (loadingPagesRef.current.has(page) || pages[page]) return;

      loadingPagesRef.current.add(page);
      console.log('Loading page:', page);

      try {
        const results = await db
          .select()
          .from(schema.addresses)
          .limit(PAGE_SIZE)
          .offset(page * PAGE_SIZE)
          .orderBy(schema.addresses.section_index, schema.addresses.address_name);

        if (mountedRef.current) {
          setPages((prev) => ({ ...prev, [page]: results }));
        }
      } catch (err) {
        console.error(`Error loading page ${page}:`, err);
      } finally {
        loadingPagesRef.current.delete(page);
      }
    },
    [db, pages]
  );

  // On mount, fetch total count
  useEffect(() => {
    mountedRef.current = true;
    fetchCount();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchCount]);

  // Pull-to-refresh just resets pages and fetches count again
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPages({});
    await fetchCount();
    setRefreshing(false);
  }, [fetchCount]);

  // 3) `getItem` for VirtualizedList
  const getItem = useCallback((_: unknown, index: number): ListItem => {
    return { index, page: Math.floor(index / PAGE_SIZE) };
  }, []);

  // 4) Render each row
  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      const pageData = pages[item.page];
      const itemIndex = item.index % PAGE_SIZE;
      const address = pageData?.[itemIndex];

      if (!address) {
        if (!loadingPagesRef.current.has(item.page)) {
          loadPage(item.page);
        }
        return (
          <View style={styles.addressItem}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        );
      }

      // Render the loaded item
      const cityPostcode = [address.city, address.post_code].filter(Boolean).join(', ');
      return (
        <View style={styles.addressItem}>
          <Text style={styles.addressName}>{address.address_name || 'Unnamed Address'}</Text>
          <Text>{address.address_line_1}</Text>
          {address.address_line_2 && <Text>{address.address_line_2}</Text>}
          {!!cityPostcode && <Text>{cityPostcode}</Text>}
          <Text>
            {address.country || ''} • Index: {item.index} • Page: {item.page}
          </Text>
        </View>
      );
    },
    [pages, loadPage]
  );

  // 5) Figure out the “current page” by seeing what’s visible
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems || viewableItems.length === 0) return;
      const first = viewableItems[0];
      if (first.index != null) {
        const newPage = Math.floor(first.index / PAGE_SIZE);
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
        }
      }
    },
    [currentPage]
  );

  // 6) Evict pages that are too far from `currentPage`
  useEffect(() => {
    setPages((prev) => {
      const newPages = { ...prev };
      const lower = currentPage - PAGE_BUFFER;
      const upper = currentPage + PAGE_BUFFER;
      for (const key of Object.keys(newPages)) {
        const pageNum = parseInt(key, 10);
        if (pageNum < lower || pageNum > upper) {
          delete newPages[pageNum];
        }
      }
      return newPages;
    });
  }, [currentPage]);

  useEffect(() => {
    const pageNumbers = Object.keys(pages).map((key) => Number(key));
    console.log('Pages in memory:', pageNumbers);
  }, [pages]);

  return (
    <SafeAreaView style={styles.container}>
      <Text >Total items {totalItems}</Text>
      <VirtualizedList
        getItem={getItem}
        getItemCount={() => totalItems}
        keyExtractor={(item) => String(item.index)}
        renderItem={renderItem}
        initialNumToRender={PAGE_SIZE}
        windowSize={5}
        maxToRenderPerBatch={PAGE_SIZE}
        updateCellsBatchingPeriod={50}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        removeClippedSubviews={false}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
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
