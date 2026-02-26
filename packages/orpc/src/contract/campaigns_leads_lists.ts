import {formErrors, generalErrors} from "@/errors";
import type {InferContractRouterInputs, InferContractRouterOutputs} from '@orpc/contract';

import {z} from "zod";

import {oc} from '@orpc/contract';

import {
	dataWithPagination,
	expandableFieldsSchema,
	paginationInputSchema,
} from "../util";

import schema from '../schema/campaigns_leads_lists';


export const list = oc
	.route({method: 'GET', path: `/{campaignId}/leads_lists`})
	.input(
		z.object({
			campaignId: z.uuid(),
		}).extend(
			expandableFieldsSchema(["list", "campaign", "counts"]).shape
		)
			.extend(paginationInputSchema().shape)
			.partial()
			.required({
				campaignId: true,
			})
	)
	.output(dataWithPagination(schema.list));

export const create = oc
	.route({
		method: 'POST',
		path  : `/{campaignId}/leads_lists`
	})
	.errors({
		...generalErrors(schema.insert),
		...formErrors(schema.insert),
	})
	.input(schema.insert)
	.output(schema.select);

export const remove = oc
	.route({method: 'DELETE', path: `/{campaignId}/leads_lists/{id}`});

export type TCampaignsLeadsLists = {
	ListInput: InferContractRouterInputs<typeof list>;
	ListOutput: InferContractRouterOutputs<typeof list>;

	CreateInput: InferContractRouterInputs<typeof create>;
	CreateOutput: InferContractRouterOutputs<typeof create>;

	RemoveInput: InferContractRouterInputs<typeof remove>;
};

export default {
	list,
	create,
	remove
};
