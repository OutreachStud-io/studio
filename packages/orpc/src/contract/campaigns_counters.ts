import {z} from "zod";
import {oc} from '@orpc/contract';

import {listSchema} from "@/schema/campaigns_counters";
import {timeIntervalFilterSchema} from "@/util";

/**
 * Counters for Campaign - returns a list of counters, grouped by day,
 * for a campaign. GET filters for the selected period (startDate, endDate)
 * will be passed as query params. Also supports predefined periods
 */
export const list = oc
	.route({
		method : 'GET',
		path   : `/`,
		summary: 'Get main counters/stats for all active campaigns in a project or a specific campaign',
		tags   : ['Campaigns', 'Stats', 'Counters'],
	})
	.input(z.object({
		projectId : z.uuid(),
		campaignId: z.uuid().optional(),
	}).refine(
		// we need project id to pull stats for active campaigns in a project (if no campaign id is provided)
		(data) => data.campaignId || data.projectId, {
			message: "Either campaignId or projectId is required",
			path   : ["projectId"],
		}
	))
	.output(listSchema);


export default {
	list
};
