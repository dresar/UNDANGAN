import { pgTable, text, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { invitations } from './invitations';

export const invitationVersions = pgTable('invitation_versions', {
  id: text('id').primaryKey(),
  invitationId: text('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull().default(1),
  draftConfig: jsonb('draft_config').notNull(),
  publishedSnapshot: jsonb('published_snapshot'),
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
