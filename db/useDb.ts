import { useMemo } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { createDrizzleDb } from './index';

export function useDb() {
  const sqlite = useSQLiteContext();
  const db = useMemo(() => createDrizzleDb(sqlite), [sqlite]);

  return db;
}
