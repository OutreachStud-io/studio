import {z} from "zod";

import {oc} from '@orpc/contract';

import {
	dataWithPagination,
	expandableFieldsSchema,
	filterSchema,
	paginationInputSchema, sortSchema
} from "../util";

import {selectSchema, listSchema} from '../schema/campaigns_leads';

export const list = oc
	.route({method: 'GET', path: `/{campaignId}/leads`})
	.input(
		z.object({
			campaignId: z.uuid(),
		}).extend(
			expandableFieldsSchema(["lead"]).shape
		)
			.extend(paginationInputSchema().shape)
			.extend(
				filterSchema(
					["lead.email", "lead.esp", "status"]
				).shape
			)
			.extend(
				sortSchema(
					["lead.email", "lead.esp", "status"]
				).shape
			)
			.partial()
			.required({
				campaignId: true,
			})
	)
	.output(dataWithPagination(listSchema));

export default {
	list,
};
