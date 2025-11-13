import {z} from 'zod';

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {campaignsTable, campaignStatusTypes} from "@outreachstudio/dbschema";

// Db schema
export const dbSelectSchema = createSelectSchema(campaignsTable);
export const dbInsertSchema = createInsertSchema(campaignsTable);
export const dbUpdateSchema = createUpdateSchema(campaignsTable);

// Contract schema
export const selectSchema = dbSelectSchema.extend({
	// we overwrite here the status to be enum of campaignStatusTypes
	// because drizzle-zod generates it as string
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	startsAt : z.coerce.date().optional(),
	endsAt   : z.coerce.date().optional(),
	status   : z.enum(campaignStatusTypes),
	counters : z.object({
		sent        : z.number().default(0), // number of sent emails in the campaign
		opened      : z.number().default(0), // number of opened emails in the campaign
		clicked     : z.number().default(0), // number of clicked emails in the campaign
		replied     : z.number().default(0), // number of replied emails in the campaign
		bounced     : z.number().default(0), // number of bounced emails in the campaign
		unsubscribed: z.number().default(0), // number of unsubscribed emails in the campaign
		delivered   : z.number().default(0), // number of delivered emails in the campaign
		leads       : z.number().default(0), // number of leads in the campaign
		sequences   : z.number().default(0), // number of sequences in the campaign
	})
});


export const listSchema = z.array(selectSchema);
export const insertSchema = dbInsertSchema.pick({
	projectId  : true,
	name       : true,
	description: true,
	startsAt   : true,
	endsAt     : true,
	tzSend     : true,
});

export const updateSchema = dbUpdateSchema.pick({
	name       : true,
	description: true,
	startsAt   : true,
	endsAt     : true,
	tzSend     : true,
});

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
	update: updateSchema
};
