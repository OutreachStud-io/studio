import {z} from "zod";

import {oc} from '@orpc/contract';

import {paginationInputSchema} from "../util";

import schema, {listSchema, selectSchema} from '../schema/campaigns_sequences_versions';


/**
 * Create Campaign Sequence Version
 */
export const create = oc
	.route({method: 'POST', path: `/:sequenceId`})
	.input(schema.insert)
	.output(schema.select);

/**
 * Update Campaign Sequence Version
 */
export const update = oc
	.route({method: 'PUT', path: `/:id`})
	.input(schema.insert)
	.output(schema.select);

/**
 * List Campaign Sequence Versions
 */
export const list = oc
	.route({method: 'GET', path: `/:sequenceId`})
	.input(
		z.object({
			sequenceId: z.string(),
		})
			.extend(paginationInputSchema().shape)
			.partial()
			.required({
				sequenceId: true
			})
	)
	.output(listSchema);

/**
 * Get Campaign Sequence Version
 */
export const get = oc
	.route({method: 'GET', path: `/{id}`})
	.input(z.object({
		id: z.uuid(),
	}))
	.output(selectSchema);


export default {
	list, update, create, get,
};
