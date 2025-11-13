import {queryOptions, useQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

type TInputParams = Parameters<typeof tanstackClient.campaignsCounters.list.call>[0];

export const getCampaignsStatsQueryOptions = (p: TInputParams) => {
	return queryOptions({
		queryKey: ['campaigns', 'stats', p.campaignId ? 'show' : 'list', p],
		queryFn : () => tanstackClient.campaignsCounters.list.call(p),
	});
};

type UseOptions = {
	input: TInputParams;
	queryConfig?: QueryConfig<typeof getCampaignsStatsQueryOptions>;
};

export const useCampaignsStatsQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getCampaignsStatsQueryOptions(params.input),
		...params.queryConfig,
	});
};
