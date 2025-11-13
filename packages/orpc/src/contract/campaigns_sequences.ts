import {z} from "zod";

import {oc} from '@orpc/contract';

import {paginationInputSchema} from "../util";

import schema, {listSchema, selectSchema} from '../schema/campaigns_sequences';

/**
 * Create Campaign Sequence - creates a new campaign sequence
 */
export const create = oc
	.route({method: 'POST', path: `/`})
	.input(schema.insert)
	.output(schema.select);

/**
 * List Campaign Sequences - returns a list of campaigns sequences
 */
export const list = oc
	.route({method: 'GET', path: `/`})
	.input(
		z.object({
			campaignId: z.string(),
		})
			.extend(paginationInputSchema().shape)
			.partial()
			.required({
				campaignId: true
			})
	)
	.output(listSchema);


export default {
	list, create,
};
