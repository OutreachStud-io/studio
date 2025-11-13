import {z} from "zod";

import {oc} from '@orpc/contract';

import {
	dataWithPagination,
	expandableFieldsSchema,
	paginationInputSchema,
} from "../util";

import {selectSchema, listSchema} from '../schema/campaigns_leads_lists';

export const list = oc
	.route({method: 'GET', path: `/{campaignId}/leads_lists`})
	.input(
		z.object({
			campaignId: z.uuid(),
		}).extend(
			expandableFieldsSchema(["list", "campaign"]).shape
		)
			.extend(paginationInputSchema().shape)
			.partial()
			.required({
				campaignId: true,
			})
	)
	.output(dataWithPagination(listSchema));

export default {
	list,
};
