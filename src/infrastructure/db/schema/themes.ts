import { pgTable, text, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';

export const themes = pgTable('themes', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  version: varchar('version', { length: 20 }).notNull().default('1.0.0'),
  category: varchar('category', { length: 50 }).notNull().default('classic'),
  config: jsonb('config').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
