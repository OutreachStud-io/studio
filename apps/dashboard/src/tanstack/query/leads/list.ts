import {queryOptions, useQuery, useSuspenseQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

export type TListInputParams = Parameters<typeof tanstackClient.leads.list.call>[0];
export type TListOutputResult = Awaited<ReturnType<typeof tanstackClient.leads.list.call>>;
export type TListOutputResultItem = TListOutputResult["data"][number];


export const getLeadsListQueryOptions = (p: TListInputParams) => {
	return queryOptions({
		queryKey: ['leads', 'list', p],
		queryFn : () => tanstackClient.leads.list.call(p),
	});
};

type UseOptions = {
	input: TListInputParams;
	queryConfig?: QueryConfig<typeof getLeadsListQueryOptions>;
};

export const useLeadsListQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getLeadsListQueryOptions(params.input),
		...params.queryConfig,
	});
};


export const useSuspenseLeadsListQuery = (
	params: UseOptions
) => {
	return useSuspenseQuery({
		...getLeadsListQueryOptions(params.input),
		...params.queryConfig,
	});
};
