import {z} from 'zod';

import {oc} from '@orpc/contract';

import {dataWithPagination, paginationInputSchema} from "../util";

import {listSchema} from '../schema/campaigns_notifications';

/**
 * List Campaign Notifications - returns a list of campaigns
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
	.output(dataWithPagination(listSchema));


export default {
	list,
};
