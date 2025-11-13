import {queryOptions, useQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

type TInputParams = Parameters<typeof tanstackClient.campaigns.show.call>[0];


export const getCampaignQueryOptions = (p: TInputParams) => {
	return queryOptions({
		queryKey: ['campaigns', 'show', p.id],
		queryFn : () => tanstackClient.campaigns.show.call(p),
	});
};

type UseOptions = {
	input: TInputParams;
	queryConfig?: QueryConfig<typeof getCampaignQueryOptions>;
};

export const useCampaignQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getCampaignQueryOptions(params.input),
		...params.queryConfig,
	});
};
