import React, { useCallback, useState, useRef, useEffect } from 'react';
import { VirtualizedList, ViewToken, RefreshControl, VirtualizedListProps } from 'react-native';

type PaginatedVirtualizedListProps = {
  /** Total number of items in the whole list */
  totalItemsLength: number;

  /** A function that fetches data for a single page of items */
  fetchPage: (pageIndex: number, pageSize: number) => Promise<any[]>;

  /** Items per page. Default = 50 */
  pageSize?: number;

  /** Pages around the current page to keep loaded. Default = 1 */
  pageBuffer?: number;

  /** Render function for one item */
  renderItem: (info: { item: any; index: number }) => JSX.Element;

  /** Function to extract a unique key for each item */
  keyExtractor?: (item: any, index: number) => string;

  /** Optional extra props to pass to the VirtualizedList */
  listProps?: Omit<VirtualizedListProps<any>, 'data' | 'renderItem' | 'getItem' | 'getItemCount'>;
};

export function PaginatedVirtualizedList({
  totalItemsLength,
  fetchPage,
  pageSize = 50,
  pageBuffer = 1,
  renderItem,
  keyExtractor,
  listProps = {},
}: PaginatedVirtualizedListProps) {
  const [pages, setPages] = useState<Record<number, any[]>>({});
  const [totalItems, setTotalItems] = useState(totalItemsLength);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const loadingPagesRef = useRef(new Set<number>());
  const mountedRef = useRef(true);

  // Keep track if component is mounted
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // If totalItemsLength changes from the outside, update local state
  useEffect(() => {
    setTotalItems(totalItemsLength);
  }, [totalItemsLength]);

  /**
   * Load a given page if not in memory or currently loading
   */
  const loadPage = useCallback(
    async (pageIndex: number) => {
      if (loadingPagesRef.current.has(pageIndex) || pages[pageIndex]) {
        return;
      }
      loadingPagesRef.current.add(pageIndex);

      try {
        const data = await fetchPage(pageIndex, pageSize);
        if (mountedRef.current) {
          setPages((prev) => ({
            ...prev,
            [pageIndex]: data,
          }));
        }
      } catch (error) {
        console.error(`Error loading page ${pageIndex}:`, error);
      } finally {
        loadingPagesRef.current.delete(pageIndex);
      }
    },
    [fetchPage, pageSize, pages]
  );

  /**
   * Load the current page plus or minus the pageBuffer
   */
  useEffect(() => {
    const lower = currentPage - pageBuffer;
    const upper = currentPage + pageBuffer;

    for (let p = lower; p <= upper; p++) {
      if (p >= 0 && p < Math.ceil(totalItems / pageSize)) {
        loadPage(p);
      }
    }
  }, [currentPage, pageBuffer, totalItems, pageSize, loadPage]);

  /**
   * Optionally remove pages that are far outside the buffer
   * so we don’t hold them in memory forever.
   */
  useEffect(() => {
    setPages((prev) => {
      const newPages = { ...prev };
      const lower = currentPage - pageBuffer;
      const upper = currentPage + pageBuffer;

      Object.keys(newPages).forEach((key) => {
        const pageNum = parseInt(key, 10);
        if (pageNum < lower || pageNum > upper) {
          delete newPages[pageNum];
        }
      });
      return newPages;
    });
  }, [currentPage, pageBuffer]);

  /**
   * Required by VirtualizedList:
   * Tells how many total items exist.
   */
  const getItemCount = useCallback(() => totalItems, [totalItems]);

  /**
   * Required by VirtualizedList:
   * Return the item at a given index.
   */
  const getItem = useCallback(
    (_: any, index: number) => {
      const pageIndex = Math.floor(index / pageSize);
      const itemIndex = index % pageSize;

      const pageData = pages[pageIndex];
      if (!pageData) return null; // not loaded yet
      return pageData[itemIndex] ?? null;
    },
    [pageSize, pages]
  );

  /**
   * We detect the first viewable index so we know
   * which page the user is on.
   */
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
    [currentPage, pageSize]
  );

  /**
   * Pull-to-refresh: clear pages so they re-fetch when user scrolls.
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPages({});
    setRefreshing(false);
  }, []);

  return (
    <VirtualizedList<any>
      // Spread any extra list props
      {...listProps}
      data={null} // Because we rely on getItem & getItemCount
      getItem={getItem}
      getItemCount={getItemCount}
      renderItem={renderItem}
      keyExtractor={
        keyExtractor || ((_, idx) => String(idx)) // Fallback if none provided
      }
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}
