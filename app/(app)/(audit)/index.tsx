import { count } from 'drizzle-orm';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import { PaginatedVirtualizedList } from '~/components/PaginatedVirtualizedList';
import { schema } from '~/db';
import { useDb } from '~/db/useDb';
import { ListItem } from '~/types/machinePark';


export default function Customers() {
  const db = useDb();
  const [totalItems, setTotalItems] = useState(0);

  const fetchCount = useCallback(async () => {
    const dbCount = await db.select({ count: count() }).from(schema.addresses);
    return dbCount[0]?.count ?? 0;
  }, [db]);

  useEffect(() => {
    fetchCount()
      .then(setTotalItems)
      .catch((err) => console.error('Error fetching count:', err));
  }, [fetchCount]);

  const fetchPage = useCallback(
    async (pageIndex: number, pageSize: number) => {
      return db
        .select()
        .from(schema.addresses)
        .limit(pageSize)
        .offset(pageIndex * pageSize)
        .orderBy(schema.addresses.section_index, schema.addresses.address_name);
    },
    [db]
  );

  const renderAddressItem = ({ item }: { item: any }) => {
    const cityPostcode = [item.city, item.post_code].filter(Boolean).join(', ');

    return (
      <View style={styles.addressItem}>
        <Text style={styles.addressName}>{item.address_name || 'Unnamed Address'}</Text>
        <Text>{item.address_line_1}</Text>
        {item.address_line_2 && <Text>{item.address_line_2}</Text>}
        {!!cityPostcode && <Text>{cityPostcode}</Text>}
        <Text>
          {item.country || ''}
        </Text>
      </View>
    );
  }

  const keyExtractor = (item: any, index: number) => {
    return item?.id ? `${item.id}` : `row-${index}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <PaginatedVirtualizedList keyExtractor={keyExtractor} RenderCard={renderAddressItem} totalItems={totalItems} />
    </SafeAreaView>
  );
}


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

