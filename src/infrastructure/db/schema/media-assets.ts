import { pgTable, text, timestamp, varchar, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const mediaAssets = pgTable('media_assets', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  origin: varchar('origin', { length: 50 }).notNull(), // USER, SHARED_THEME, AI_GENERATED, SYSTEM
  status: varchar('status', { length: 50 }).notNull().default('READY'),
  originalUrl: text('original_url').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull().default('image/webp'),
  width: integer('width').notNull().default(0),
  height: integer('height').notNull().default(0),
  sizeBytes: integer('size_bytes').notNull().default(0),
  aspectRatio: varchar('aspect_ratio', { length: 20 }).notNull().default('1:1'),
  isTransparent: boolean('is_transparent').notNull().default(false),
  checksum: varchar('checksum', { length: 64 }),
  themeTag: varchar('theme_tag', { length: 100 }),
  componentSlotTag: varchar('component_slot_tag', { length: 100 }),
  generationPrompt: text('generation_prompt'),
  variants: jsonb('variants').notNull().default('[]'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
