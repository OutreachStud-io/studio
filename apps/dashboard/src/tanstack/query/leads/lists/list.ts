import {queryOptions, useQuery, useSuspenseQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

export type TListInputParams = Parameters<typeof tanstackClient.leadsLists.list.call>[0];
export type TListOutputResult = Awaited<ReturnType<typeof tanstackClient.leadsLists.list.call>>;
export type TListOutputResultItem = TListOutputResult["data"][number];


export const getLeadsListsListQueryOptions = (p: TListInputParams) => {
	return queryOptions({
		queryKey: ['leads', 'lists', 'list', p],
		queryFn : () => tanstackClient.leadsLists.list.call(p),
	});
};

type UseOptions = {
	input: TListInputParams;
	queryConfig?: QueryConfig<typeof getLeadsListsListQueryOptions>;
};

export const useLeadsListsListQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getLeadsListsListQueryOptions(params.input),
		...params.queryConfig,
	});
};


export const useSuspenseLeadsListsListQuery = (
	params: UseOptions
) => {
	return useSuspenseQuery({
		...getLeadsListsListQueryOptions(params.input),
		...params.queryConfig,
	});
};
