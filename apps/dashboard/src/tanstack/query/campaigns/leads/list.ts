import {queryOptions, useQuery, useSuspenseQuery, keepPreviousData} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

export type TListInputParams = Parameters<typeof tanstackClient.campaignsLeads.list.call>[0];
export type TListOutputResult = Awaited<ReturnType<typeof tanstackClient.campaignsLeads.list.call>>;
export type TListOutputResultItem = TListOutputResult["data"][number];
export type TListOutputResultItemFilterableFields = NonNullable<TListInputParams["filter"]>[number]
export type TListOutputResultItemSortableFields = NonNullable<TListInputParams["sort"]>[number]


export const getCampaignLeadsQueryOptions = (p: TListInputParams) => {
	return queryOptions({
		queryKey       : ['campaigns', 'leads', 'list', p],
		queryFn        : () => tanstackClient.campaignsLeads.list.call(p),
		placeholderData: keepPreviousData,
	});
};

type UseOptions = {
	input: TListInputParams;
	queryConfig?: QueryConfig<typeof getCampaignLeadsQueryOptions>;
};

export const useCampaignLeadsQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getCampaignLeadsQueryOptions(params.input),
		...params.queryConfig,
	});
};

export const useSuspenseCampaignLeadsQuery = (
	params: UseOptions
) => {
	return useSuspenseQuery({
		...getCampaignLeadsQueryOptions(params.input),
		...params.queryConfig,
	});
};
