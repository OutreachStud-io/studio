import {z} from 'zod';

import {createSelectSchema} from "drizzle-zod";

import {
	campaignleadListsTable,
} from "@outreachstudio/dbschema";

import {selectSchema as leadsListsSelectSchema} from "./leads_lists";
import {selectSchema as campaignsSelectSchema} from "./campaigns";

// Db schema
export const dbLeadSelectSchema = createSelectSchema(campaignleadListsTable);

// Contract schema
export const selectSchema = dbLeadSelectSchema
	.extend({
		// expandable
		list    : leadsListsSelectSchema.optional(),
		campaign: campaignsSelectSchema.optional(),
	});

export const listSchema = z.array(selectSchema);

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
};
