import { integer, real, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import contracts from './contracts';

const addresses = sqliteTable('addresses', {
  id: integer('id', { mode: 'number' }).notNull(),
  market: text('market').notNull(),
  third: integer('third').notNull(),
  address_nr: integer('address_nr').notNull(),
  company: integer('company', { mode: 'boolean' }).notNull(),
  address_name: text('address_name').notNull(),
  address_line_1: text('address_line_1').notNull(),
  address_line_2: text('address_line_2').notNull(),
  city: text('city').notNull(),
  post_code: text('post_code').notNull(),
  area: text('area').notNull(),
  state: text('state').notNull(),
  state_name: text('state_name').notNull(),
  country: text('country', { length: 2 }).notNull(),
  language: text('language', { length: 2 }).notNull(),
  creation_date: text('creation_date').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  timezone: text('timezone').notNull(),
  assets: integer('assets', { mode: 'number' }).notNull(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  address: one(addresses, {
    fields: [contracts.address_nr],
    references: [addresses.address_nr],
  }),
}));

export default addresses;
