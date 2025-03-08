import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useDb } from '~/db/useDb';
import { schema } from '~/db';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuth } from '~/lib/context/authContext';
import { router } from 'expo-router';

// Type for address data
type Address = typeof schema.addresses.$inferSelect;

export const Home = () => {
  const db = useDb();
  const sqliteDb = useSQLiteContext(); // Only used for checking tables
  const { signOut } = useAuth(); // Get signOut function from auth context

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTables, setAvailableTables] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First check what tables are available
      const tables = await checkDatabaseTables();
      console.log('Tables in database:', tables);

      if (tables.includes('addresses')) {
        // Load data using Drizzle
        const data = await getDataWithDrizzle(10, 0);
        console.log('Data fetched successfully:', data.length, 'addresses found');
      } else {
        throw new Error(`Required tables not found. Available tables: ${tables.join(', ')}`);
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching data', err);
      setError(err?.toString() || 'Unknown error');
      setLoading(false);
    }
  };

  // Check what tables exist in the database
  async function checkDatabaseTables(): Promise<string[]> {
    try {
      // Get table names
      const tables = await sqliteDb.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table';",
        []
      );

      const tableNames = tables.map((table: any) => table.name as string);
      console.log('Available tables:', tableNames);
      setAvailableTables(tableNames);

      return tableNames;
    } catch (err) {
      console.error('Error checking database tables:', err);
      throw err;
    }
  }

  // Load data with Drizzle ORM
  // limits and offset are parameters of the function // lazy list/loading
  async function getDataWithDrizzle(limit: number, offset: number) {
    try {
      // Using Drizzle ORM for type-safe queries
      const results = await db.select().from(schema.addresses).limit(limit);

      console.log('Results count:', results.length);
      setAddresses(results);
      return results;
    } catch (err: any) {
      console.error('Drizzle Error:', err);
      setError(`Error: ${err?.toString() || 'Unknown error'}`);
      throw err;
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log('[HOME] Attempting to sign out');
      const result = await signOut();
      if (result.success) {
        console.log('[HOME] Sign out successful, redirecting to auth page');
        // The navigation will be handled automatically by the auth protection in _layout.tsx
        // but we can force a redirect to the login page just to be sure
        setTimeout(() => {
          router.replace('/auth/(login)');
        }, 100); // Small delay to ensure state updates first
      } else {
        console.error('[HOME] Sign out failed:', result.message);
      }
    } catch (err) {
      console.error('[HOME] Error during sign out:', err);
    }
  };

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

export default Home;
