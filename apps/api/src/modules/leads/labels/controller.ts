import {z} from "zod";
import {ORPCError} from '@orpc/server';
import {faker} from "@faker-js/faker";

import {Controller, Param} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {schema} from "@outreachstudio/orpc/schema";
import {contract} from '@outreachstudio/orpc/contract';

import {leadLabelTypes} from "@outreachstudio/dbschema";
import {paginatedResponse} from "@/lib/util";


@Controller()
export class LeadsLabelsController {

	@Implement(contract.leadsLabels.list)
	list() {
		return implement(contract.leadsLabels.list)
			.handler(({input}) => {
				return paginatedResponse(
					genLeadLabels(), {
						limit : input.paginate?.limit || 10,
						cursor: 0,
						total : 100,
					});
			});
	}

	@Implement(contract.leadsLabels.create)
	create() {
		return implement(contract.leadsLabels.create)
			.handler(({input, errors}) => {
				// pretend that the name is already taken
				if (input.name.length > 5) {
					throw new ORPCError('INPUT_VALIDATION_FAILED', {
						data: {
							formErrors : [],
							fieldErrors: {
								name: ['A label with this name already exists'],
							},
						},
					});
				}

				const result = genLeadLabels()[0];
				if (!result) {
					throw new Error('Failed to create lead label');
				}
				return result;
			});
	}


	@Implement(contract.leadsLabels.update)
	update(@Param('id') id: string) {
		return implement(contract.leadsLabels.update)
			.handler(({input}) => {
				console.log(id);

				const result = genLeadLabels()[0];
				if (!result) {
					throw new Error('Failed to create lead label');
				}
				return result;
			});
	}


	@Implement(contract.leadsLabels.remove)
	remove(@Param('id') id: string) {
		return implement(contract.leadsLabels.remove)
			.handler(({input}) => {
				console.log(id);
			});
	}
}


const leadLabelNames = [
	{
		name: "Interested",
		type: leadLabelTypes.positive,
	},
	{
		name: "Not interested",
		type: leadLabelTypes.warning,
	},
	{
		name: "Unassigned",
		type: leadLabelTypes.neutral,
	},
	{
		name: "Out of office",
		type: leadLabelTypes.neutral,
	},
	{
		name: "Follow up",
		type: leadLabelTypes.neutral,
	},
	{
		name: "Do not contact",
		type: leadLabelTypes.negative,
	},
	{
		name: "Automatic reply",
		type: leadLabelTypes.neutral,
	},
	{
		name: "Meeting booked",
		type: leadLabelTypes.positive,
	},
	{
		name: "Meeting completed",
		type: leadLabelTypes.positive,
	},
	{
		name: "Wrong person",
		type: leadLabelTypes.negative,
	},
	{
		name: "Converted",
		type: leadLabelTypes.positive,
	},
];

export const genLeadLabels = () => {
	const results: z.infer<typeof schema.leadsLabels.list> = [];

	leadLabelNames.forEach((label) => {
		results.push({
			id                                 : faker.string.uuid(),
			projectId                          : faker.string.uuid(),
			campaignId                         : null,
			name                               : label.name,
			description                        : faker.lorem.sentence(),
			type                               : label.type,
			aiIdentificationPrompt             : faker.lorem.paragraphs({min: 1, max: 3}),
			triggerBlacklistLead               : false,
			triggerPauseCampaign               : false,
			triggerPauseCampaignResumeAfterDays: null,
			triggerMoveToOtherList             : false,
			triggerMoveToOtherListId           : null,
			triggerCallWebhook                 : false,
			triggerCallWebhookUrl              : null,
			triggerNotifyVialEmail             : false,
			triggerNotifyViaEmailEmails        : null,
			triggerRemoveLeadFromCampaign      : false,
			triggerApplyLabelAfterPeriod       : false,
			triggerApplyLabelAfterPeriodDelay  : null,
			triggerApplyLabelAfterPeriodLabelId: null,
			triggerAutoRemoveLabel             : false,
			triggerAutoRemoveLabelDelay        : null,
		});
	});

	return results;
};
