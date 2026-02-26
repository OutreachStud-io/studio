import {queryOptions, useQuery, useSuspenseQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import type {QueryConfig} from "@/tanstack/query/config.ts";

export type TInputParams = Parameters<typeof tanstackClient.leadsLists.show.call>[0];
export type TListOutputResult = Awaited<ReturnType<typeof tanstackClient.leadsLists.show.call>>;

export const getLeadsListsGetQueryOptions = (p: TInputParams) => {
	return queryOptions({
		queryKey: ['leads', 'lists', 'show', p.id],
		queryFn : () => tanstackClient.leadsLists.show.call(p),
	});
};

type UseOptions = {
	input: TInputParams;
	queryConfig?: QueryConfig<typeof getLeadsListsGetQueryOptions>;
};

export const useLeadsListsGetQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getLeadsListsGetQueryOptions(params.input),
		...params.queryConfig,
	});
};

export const useSuspenseLeadsListsGetQuery = (
	params: UseOptions
) => {
	return useSuspenseQuery({
		...getLeadsListsGetQueryOptions(params.input),
		...params.queryConfig,
	});
};
