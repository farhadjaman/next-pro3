import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Button } from 'react-native';

import { schema, Address } from '~/db';
import { useDb } from '~/db/useDb';

export const Unassigned = () => {
  const db = useDb();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await getMachineParkData(10, 0);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching data', err);
      setLoading(false);
    }
  };

  async function getMachineParkData(limit: number, offset: number) {
    try {
      const results = await db.select().from(schema.addresses).limit(limit);
      setAddresses(results);
      return results;
    } catch (err: any) {
      console.error('Drizzle Error:', err);
      throw err;
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading addresses...</Text>
      ) : (
        <>
          <Text style={styles.subheader}>Found {addresses.length} addresses</Text>
          {addresses.length > 0 ? (
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={({ item }) => (
                <View style={styles.addressItem}>
                  <Text style={styles.addressName}>{item.address_name || 'Unnamed Address'}</Text>
                  <Text>{item.address_line_1}</Text>
                  {item.address_line_2 ? <Text>{item.address_line_2}</Text> : null}
                  <Text>{`${item.city || ''}, ${item.post_code || ''}`}</Text>
                  <Text>{`${item.country || ''}`}</Text>
                </View>
              )}
            />
          ) : (
            <Text>No addresses found</Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
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
  error: {
    color: 'red',
    marginBottom: 16,
  },
  signOutButtonContainer: {
    marginTop: 16,
  },
});

export default Unassigned;
