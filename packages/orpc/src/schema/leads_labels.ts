import {z} from 'zod';

import {isTruthy} from "remeda";

// we need the .js extension for it to be picked up and usable by other packages
// that import our schemas
import isUrl from "validator/lib/isURL.js";

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {leadLabelTypes, leadsLabelsTable} from "@outreachstudio/dbschema";

// Db schema
export const dbSelectSchema = createSelectSchema(leadsLabelsTable);
export const dbInsertSchema = createInsertSchema(leadsLabelsTable);
export const dbUpdateSchema = createUpdateSchema(leadsLabelsTable);

// Contract schema
export const selectSchema = dbSelectSchema.extend({
	type: z.enum(leadLabelTypes),
});

export const listSchema = z.array(selectSchema);

const insertOrUpdate = (schema: typeof dbInsertSchema | typeof dbUpdateSchema) => {
	return schema.extend({
		name       : z.string()
			.min(1, 'Name is required')
			.max(50, 'Name must be at most 50 characters long'),
		description: z.string()
			.max(1000, 'Description must be at most 1000 characters long')
			.optional(),
		type       : z.enum(leadLabelTypes),

		// not part of db, just form utilities
		isGlobal      : z.boolean(),
		useAIDetection: z.boolean(),
	}).omit({
		id: true
	}).superRefine((input, ctx) => {
		if (isTruthy(input.triggerPauseCampaign) && !isTruthy(input.triggerPauseCampaignResumeAfterDays)) {
			ctx.addIssue({
				code   : "custom",
				message: 'This is a required field',
				path   : ["triggerPauseCampaignResumeAfterDays"]
			});
		}

		if (isTruthy(input.triggerMoveToOtherList) && !isTruthy(input.triggerMoveToOtherListId)) {
			ctx.addIssue({
				code   : "custom",
				message: 'This is a required field',
				path   : ["triggerMoveToOtherListId"]
			});
		}

		if (isTruthy(input.triggerCallWebhook)) {
			if (!isTruthy(input.triggerCallWebhookUrl)) {
				ctx.addIssue({
					code   : "custom",
					message: 'This is a required field to be called',
					path   : ["triggerCallWebhookUrl"]
				});
			} else if (!isUrl(input.triggerCallWebhookUrl)) {
				ctx.addIssue({
					code   : "custom",
					message: 'must be a valid URL',
					path   : ["triggerCallWebhookUrl"]
				});
			}
		}

		if (isTruthy(input.triggerNotifyVialEmail) && !isTruthy(input.triggerNotifyViaEmailEmails)) {
			ctx.addIssue({
				code   : "custom",
				message: 'This is a required field',
				path   : ["triggerNotifyViaEmailEmails"]
			});
		}

		if (isTruthy(input.triggerApplyLabelAfterPeriod) && !isTruthy(input.triggerApplyLabelAfterPeriodDelay)) {
			ctx.addIssue({
				code   : "custom",
				message: 'This is a required field',
				path   : ["triggerApplyLabelAfterPeriodDelay"]
			});
		}

		if (isTruthy(input.triggerApplyLabelAfterPeriod) && !isTruthy(input.triggerApplyLabelAfterPeriodLabelId)) {
			ctx.addIssue({
				code   : "custom",
				message: 'This is a required field',
				path   : ["triggerApplyLabelAfterPeriodLabelId"]
			});
		}

		if (isTruthy(input.triggerAutoRemoveLabel) && !isTruthy(input.triggerAutoRemoveLabelDelay)) {
			ctx.addIssue({
				code   : "custom",
				message: 'This is a required field',
				path   : ["triggerAutoRemoveLabelDelay"]
			});
		}
	});
};

export const insertSchema = insertOrUpdate(dbInsertSchema);
export const updateSchema = insertOrUpdate(dbUpdateSchema);

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
	update: updateSchema
};
