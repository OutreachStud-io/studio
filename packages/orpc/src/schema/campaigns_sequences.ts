import {z} from 'zod';

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {campaignSequencesTable, campaignsTable} from "@outreachstudio/dbschema";

// Db schema
export const dbSelectSchema = createSelectSchema(campaignSequencesTable);
export const dbInsertSchema = createInsertSchema(campaignSequencesTable);
export const dbUpdateSchema = createUpdateSchema(campaignSequencesTable);

// Contract schema
export const selectSchema = dbSelectSchema;
export const listSchema = z.array(selectSchema);
export const insertSchema = dbInsertSchema.pick({
	delayDays: true,
});

export const updateSchema = dbUpdateSchema.pick({
	delayDays: true,
});

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
	update: updateSchema
};
