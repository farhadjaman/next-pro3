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
export type ContractsTable = typeof schema.contracts;

// Export types for the table records
export type Address = typeof schema.addresses.$inferSelect;
export type Contract = typeof schema.contracts.$inferSelect;

// Export types for insert operations
export type InsertAddress = typeof schema.addresses.$inferInsert;
export type InsertContract = typeof schema.contracts.$inferInsert;
