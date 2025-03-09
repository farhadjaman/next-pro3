import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

const addresses = sqliteTable('addresses', {
  id: integer('id', { mode: 'number' }),
  market: text('market'),
  third: integer('third', { mode: 'number' }),
  address_nr: integer('address_nr', { mode: 'number' }),
  company: integer('company', { mode: 'boolean' }),
  section_name: text('section_name', { length: 1 }),
  section_index: text('section_index', { length: 1 }),
  address_name: text('address_name'),
  address_line_1: text('address_line_1'),
  address_line_2: text('address_line_2'),
  city: text('city'),
  post_code: text('post_code'),
  area: text('area'),
  state: text('state'),
  state_name: text('state_name'),
  country: text('country', { length: 2 }),
  language: text('language', { length: 2 }),
  creation_date: text('creation_date'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  timezone: text('timezone'),
  assets: integer('assets', { mode: 'number' }),
});

export default addresses;
