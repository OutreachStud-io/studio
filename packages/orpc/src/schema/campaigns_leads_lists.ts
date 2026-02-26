import {z} from 'zod';

import {createSelectSchema, createInsertSchema} from "drizzle-zod";

import {
	campaignleadListsTable, projectsTable,
} from "@outreachstudio/dbschema";

import {selectSchema as leadsListsSelectSchema} from "./leads_lists";
import {selectSchema as campaignsSelectSchema} from "./campaigns";

// Db schema
export const dbLeadSelectSchema = createSelectSchema(campaignleadListsTable);
export const dbInsertSchema = createInsertSchema(campaignleadListsTable);


const validationSchema = {
	listId    : z.uuid(),
	campaignId: z.uuid(),
};

const schemaFactory = {
	insert: () => dbInsertSchema.extend(validationSchema).omit({id: true}),
};

// Contract schema
export const selectSchema = dbLeadSelectSchema
	.extend({
		// expandable
		createdAt: z.coerce.date(),
		list     : leadsListsSelectSchema.optional(),
		campaign : campaignsSelectSchema.optional(),
		selected : z.boolean(),

		counts: z.object({
			leads    : z.number(),
			campaigns: z.number(),
		}).optional(),
	});

export const listSchema = z.array(selectSchema);
export const insertSchema = schemaFactory.insert();


// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
};
