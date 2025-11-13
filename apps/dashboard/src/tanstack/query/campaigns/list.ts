import {queryOptions, useQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

type TInputParams = Parameters<typeof tanstackClient.campaigns.list.call>[0];


export const getCampaignsQueryOptions = (p: TInputParams) => {
	return queryOptions({
		queryKey: ['campaigns', 'list', p],
		queryFn : () => tanstackClient.campaigns.list.call(p),
	});
};

type UseOptions = {
	input: TInputParams;
	queryConfig?: QueryConfig<typeof getCampaignsQueryOptions>;
};

export const useCampaignsQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getCampaignsQueryOptions(params.input),
		...params.queryConfig,
	});
};
