import {z} from 'zod';

import {createSelectSchema} from "drizzle-zod";

import {
	campaignLeadsTable,
	espTypes,
	leadsTable,
	leadStatusTypes,
} from "@outreachstudio/dbschema";

import {selectSchema as leadsSelectSchema} from "./leads";
import {selectSchema as leadsLabelsSelectSchema} from "./leads_labels";

// Db schema
export const dbLeadSelectSchema = createSelectSchema(leadsTable);
export const dbCampaignLeadSelectSchema = createSelectSchema(campaignLeadsTable);

// Contract schema
export const selectSchema = dbCampaignLeadSelectSchema.extend({

	// so the status can be types instead of string
	status: z.enum(leadStatusTypes),

	// expandable: sequence info for this lead in this campaign
	sequences: z.object({
		count: z.number().default(0), // number of sequences passed
		total: z.number().default(0) // total number of sequences
	}).optional(),

	// expandable: lead object that holds lead info
	lead: leadsSelectSchema.optional(),

	// expandable: label info
	label: leadsLabelsSelectSchema.optional(),
});

export const listSchema = z.array(selectSchema);

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
};
