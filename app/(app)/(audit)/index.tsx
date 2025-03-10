import { count } from 'drizzle-orm';
import React, { useState, useCallback, useRef, useEffect } from 'react';
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

const PAGE_SIZE = 20;

const Customers = () => {
  const db = useDb();
  const [pages, setPages] = useState<{ [key: number]: Address[] }>({});
  const [totalItems, setTotalItems] = useState(0);
  const loadingRef = useRef(false);
  const listRef = useRef<any>(null);

  const loadPage = useCallback(
    async (page: number) => {
      console.log(`Loading page ${page}...`);
      if (loadingRef.current || pages[page]) return;

      loadingRef.current = true;
      try {
        const results = await db
          .select()
          .from(schema.addresses)
          .limit(PAGE_SIZE)
          .offset(page * PAGE_SIZE)
          .orderBy(schema.addresses.section_index, schema.addresses.address_name);

        setPages((prev) => ({ ...prev, [page]: results }));
      } catch (err) {
        console.error(`Error loading page ${page}:`, err);
      } finally {
        loadingRef.current = false;
      }
    },
    [db, pages]
  );

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const dbCount = await db.select({ count: count() }).from(schema.addresses);

        console.log('Total count:', dbCount[0]?.count);

        setTotalItems(dbCount[0]?.count || 0);
      } catch (error) {
        console.error('Error fetching total count:', error);
      }
    };
    fetchCount();
  }, []);

  const getItem = useCallback((_: unknown, index: number) => {
    return { index, page: Math.floor(index / PAGE_SIZE) };
  }, []);
  const renderItem = useCallback(
    ({ item }: { item: { index: number; page: number } }) => {
      const pageData = pages[item.page];
      const itemIndex = item.index % PAGE_SIZE;
      const address = pageData?.[itemIndex];

      if (!pageData) {
        if (!loadingRef.current) {
          loadPage(item.page);
        }

        return (
          <View style={styles.addressItem}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        );
      }

      return (
        <View style={styles.addressItem}>
          <Text style={styles.addressName}>{address.address_name || 'Unnamed Address'}</Text>
          <Text>{address.address_line_1}</Text>
          {address.address_line_2 && <Text>{address.address_line_2}</Text>}
          <Text>{`${address.city || ''}, ${address.post_code || ''}`}</Text>
          <Text>
            {address.country || ''}- {item.index} - {item.page}
          </Text>
        </View>
      );
    },
    [pages, loadPage]
  );

  return (
    <SafeAreaView style={styles.container}>
      <VirtualizedList
        ref={listRef}
        getItem={getItem}
        getItemCount={() => totalItems}
        keyExtractor={(item) => String(item.index)}
        renderItem={renderItem}
        initialNumToRender={PAGE_SIZE}
        windowSize={5}
        maxToRenderPerBatch={PAGE_SIZE}
        updateCellsBatchingPeriod={50}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
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
  addressName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  loadingText: { marginTop: 8 },
});

export default Customers;
