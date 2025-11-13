import {queryOptions, useQuery, useSuspenseQuery, keepPreviousData} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

export type TListInputParams = Parameters<typeof tanstackClient.campaignsLeadsLists.list.call>[0];
export type TListOutputResult = Awaited<ReturnType<typeof tanstackClient.campaignsLeadsLists.list.call>>;


export const getCampaignLeadsListsQueryOptions = (p: TListInputParams) => {
	return queryOptions({
		queryKey       : ['campaigns', 'leads_lists', 'list', p],
		queryFn        : () => tanstackClient.campaignsLeadsLists.list.call(p),
		placeholderData: keepPreviousData,
	});
};

type UseOptions = {
	input: TListInputParams;
	queryConfig?: QueryConfig<typeof getCampaignLeadsListsQueryOptions>;
};

export const useCampaignLeadsListsQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getCampaignLeadsListsQueryOptions(params.input),
		...params.queryConfig,
	});
};

export const useSuspenseCampaignLeadsListsQuery = (
	params: UseOptions
) => {
	return useSuspenseQuery({
		...getCampaignLeadsListsQueryOptions(params.input),
		...params.queryConfig,
	});
};
