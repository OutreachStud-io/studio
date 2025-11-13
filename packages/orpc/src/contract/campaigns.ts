import {z} from "zod";

import {oc} from '@orpc/contract';
import type {InferContractRouterInputs, InferContractRouterOutputs} from '@orpc/contract';

import {dataWithPagination, filterSchema, paginationInputSchema} from "../util";

import schema, {listSchema, selectSchema} from '../schema/campaigns';

/**
 * Create Campaign - creates a new campaign
 */
export const create = oc
	.route({method: 'POST', path: `/`})
	.input(schema.insert)
	.output(schema.select);

/**
 * List Campaign - returns a list of campaigns
 */
export const list = oc
	.route({
		method: 'GET',
		path  : `/`
	})
	.input(
		z.object({
			projectId: z.string(),
		})
			.extend(paginationInputSchema().shape)
			.partial()
			.required({
				projectId: true
			})
	)
	.output(dataWithPagination(listSchema));

/**
 * Show Campaign - returns a campaign
 */
export const show = oc
	// show otherwise {id} will overwrite all other segments
	// that we may have defined in the parent route
	.route({method: 'GET', path: `/show/{id}`})
	.input(z.object({
		id: z.uuid(),
	}))
	.output(selectSchema);

export type TCampaigns = {
	ListInput: InferContractRouterInputs<typeof list>;
	ListOutput: InferContractRouterOutputs<typeof list>;
};

export default {
	list, create, show,
};
