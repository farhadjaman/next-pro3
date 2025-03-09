import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';

import * as schema from '~/db/schema';

export function createDrizzleDb(db: SQLiteDatabase) {
  return drizzle(db, { schema });
}

// Export the schema for type generation and other utilities
export { schema };

// Export type definitions for the database and tables
export type AddressesTable = typeof schema.addresses;
export type AssetsTable = typeof schema.assets;
export type AddressesIndexesTable = typeof schema.addressesIndexes;

// Export types for the table records
export type Address = typeof schema.addresses.$inferSelect;
export type Asset = typeof schema.assets.$inferSelect;
export type AddressIndex = typeof schema.addressesIndexes.$inferSelect;
