import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const addressesIndexes = sqliteTable('addresses_indexes', {
  section_index: text('section_index', { length: 1 }),
  records: integer('records', { mode: 'number' }),
});

export default addressesIndexes;
