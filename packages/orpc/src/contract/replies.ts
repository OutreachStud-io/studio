import {z} from 'zod';

import {oc} from '@orpc/contract';

import {timeIntervalFilterSchema} from "../util";
import {listLocationsSchema} from '../schema/replies';


/**
 * List replies locations - returns a list of locations where replies
 * originated from
 */
export const listLocations = oc
	.route({method: 'GET', path: `/locations`})
	.input(timeIntervalFilterSchema)
	.output(listLocationsSchema);


/**
 * List campaign replies locations - returns a list of locations where replies
 * originated from - for a specific campaign
 */
export const listCampaignLocations = oc
	.route({method: 'GET', path: `/:campaignId/locations`})
	.input(z.object({
		campaignId: z.uuid()
	}))
	.output(listLocationsSchema);


export default {
	listLocations,
	listCampaignLocations
};
