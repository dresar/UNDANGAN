import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const invitations = pgTable('invitations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 150 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('DRAFT'), // DRAFT, READY, PUBLISHED, ARCHIVED
  title: varchar('title', { length: 255 }).notNull(),
  groomName: varchar('groom_name', { length: 100 }).notNull(),
  brideName: varchar('bride_name', { length: 100 }).notNull(),
  eventDate: varchar('event_date', { length: 50 }).notNull(),
  activeVersionNumber: text('active_version_number').notNull().default('1'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
