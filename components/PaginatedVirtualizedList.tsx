import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ActivityIndicator, VirtualizedList, RefreshControl, ViewToken } from 'react-native';

import { schema } from '~/db';
import { useDb } from '~/db/useDb';
import { ListItem } from '~/types/machinePark';

const PAGE_SIZE = 10;
const PAGE_BUFFER = 1;

type PaginatedVirtualizedListProps = {
  keyExtractor?: (item: any, index: number) => string;
  RenderCard: (item: any) => JSX.Element;
  totalItems: number;
  pageSize?: number;
  pageBuffer?: number;
};

export const PaginatedVirtualizedList = ({
  keyExtractor,
  RenderCard,
  totalItems,
  pageSize = PAGE_SIZE,
  pageBuffer = PAGE_BUFFER,
}: PaginatedVirtualizedListProps) => {
  const db = useDb();
  const [pages, setPages] = useState<Record<number, any[]>>({});
  const [refreshing, setRefreshing] = useState(false);
  const loadingPagesRef = useRef(new Set<number>());
  const mountedRef = useRef(true);
  const [currentPage, setCurrentPage] = useState(0);

  const loadPage = useCallback(
    async (page: number) => {
      if (loadingPagesRef.current.has(page) || pages[page]) return;

      loadingPagesRef.current.add(page);

      try {
        const results = await db
          .select()
          .from(schema.addresses)
          .limit(pageSize)
          .offset(page * pageSize)
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPages({});
    setRefreshing(false);
  }, []);

  const getItem = useCallback((_: unknown, index: number): ListItem => {
    return { index, page: Math.floor(index / pageSize) };
  }, []);

  // 4) Render each row
  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      const pageData = pages[item.page];
      const itemIndex = item.index % pageSize;
      const itemData = pageData?.[itemIndex];

      if (!itemData) {
        if (!loadingPagesRef.current.has(item.page)) {
          loadPage(item.page);
        }
        return (
          <View>
            <ActivityIndicator size="small" />
          </View>
        );
      }

      return <RenderCard item={itemData}/>;
    },
    [pages, loadPage]
  );

  // 5) Figure out the "current page" by seeing what's visible
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems || viewableItems.length === 0) return;
      const first = viewableItems[0];
      if (first.index != null) {
        const newPage = Math.floor(first.index / pageSize);
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
      const lower = currentPage - pageBuffer;
      const upper = currentPage + pageBuffer;
      for (const key of Object.keys(newPages)) {
        const pageNum = parseInt(key, 10);
        if (pageNum < lower || pageNum > upper) {
          delete newPages[pageNum];
        }
      }
      return newPages;
    });
  }, [currentPage]);

  const getItemCount = useCallback(() => totalItems, [totalItems]);

  useEffect(() => {
    const pageNumbers = Object.keys(pages).map((key) => Number(key));
    console.log('Pages in memory:', pageNumbers);
  }, [pages]);

  return (
    <VirtualizedList
      getItem={getItem}
      getItemCount={getItemCount}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialNumToRender={pageSize}
      windowSize={5}
      maxToRenderPerBatch={pageSize}
      updateCellsBatchingPeriod={50}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      removeClippedSubviews={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
    />
  );
};
