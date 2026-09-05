import { pgTable, text, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const aiTasks = pgTable('ai_tasks', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  invitationId: text('invitation_id'),
  taskType: varchar('task_type', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('queued'), // queued, running, completed, failed
  inputPayload: jsonb('input_payload').notNull(),
  outputPayload: jsonb('output_payload'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
