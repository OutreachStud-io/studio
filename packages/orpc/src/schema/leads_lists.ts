import {z} from 'zod';

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {leadsListsTable} from "@outreachstudio/dbschema";

// Db schema
export const dbSelectSchema = createSelectSchema(leadsListsTable);
export const dbInsertSchema = createInsertSchema(leadsListsTable);
export const dbUpdateSchema = createUpdateSchema(leadsListsTable);

// Contract schema
export const selectSchema = dbSelectSchema.extend({
	createdAt: z.coerce.date(),
});
export const listSchema = z.array(selectSchema);
export const insertSchema = dbInsertSchema;
export const updateSchema = dbUpdateSchema.omit({
	id: true,
});

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
	update: updateSchema
};
