import {z} from 'zod';

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {campaignSequenceVersionsTable, campaignsTable} from "@outreachstudio/dbschema";

// Db schema
export const dbSelectSchema = createSelectSchema(campaignSequenceVersionsTable);
export const dbInsertSchema = createInsertSchema(campaignSequenceVersionsTable);
export const dbUpdateSchema = createUpdateSchema(campaignSequenceVersionsTable);

// Contract schema
export const selectSchema = dbSelectSchema;
export const listSchema = z.array(selectSchema);
export const insertSchema = dbInsertSchema.pick({
	contentSubject: true,
	contentBody   : true,
});

export const updateSchema = dbUpdateSchema.pick({
	contentSubject: true,
	contentBody   : true,
});

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
	update: updateSchema
};
