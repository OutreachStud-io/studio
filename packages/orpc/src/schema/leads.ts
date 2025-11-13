import {z} from 'zod';

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {espTypes, leadLabelTypes, leadsTable} from "@outreachstudio/dbschema";

// Db schema
export const dbSelectSchema = createSelectSchema(leadsTable);
export const dbInsertSchema = createInsertSchema(leadsTable);
export const dbUpdateSchema = createUpdateSchema(leadsTable);

// Contract schema
export const selectSchema = dbSelectSchema.extend({
	createdAt: z.coerce.date(),
	esp      : z.enum(espTypes),
});
export const listSchema = z.array(selectSchema);
export const insertSchema = dbInsertSchema.omit({
	id       : true,
	createdAt: true,
});

export const updateSchema = dbUpdateSchema.omit({
	id       : true,
	createdAt: true,
});

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
	update: updateSchema
};
