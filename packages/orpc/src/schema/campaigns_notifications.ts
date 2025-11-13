import {z} from 'zod';

import {createSelectSchema} from "drizzle-zod";

import {campaignNotificationsTable, notificationTypes} from "@outreachstudio/dbschema";

// Db schema
export const dbSelectSchema = createSelectSchema(campaignNotificationsTable);

// Contract schema
export const selectSchema = dbSelectSchema.extend({
	type       : z.enum(notificationTypes),
	createdAt  : z.coerce.date(),
	seenAt     : z.coerce.date().optional(),
	dismissedAt: z.coerce.date().optional(),
});
export const listSchema = z.array(selectSchema);

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
};
