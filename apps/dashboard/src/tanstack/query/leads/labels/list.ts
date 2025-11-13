import {queryOptions, useSuspenseQuery, useQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

type TListInputParams = Parameters<typeof tanstackClient.leadsLabels.list.call>[0];
export type TListOutputResult = Awaited<ReturnType<typeof tanstackClient.leadsLabels.list.call>>;


export const getQueryOptions = (p: TListInputParams) => {
	return queryOptions({
		queryKey: ['leads', 'labels', 'list', p],
		queryFn : () => tanstackClient.leadsLabels.list.call(p),
	});
};

type UseOptions = {
	input: TListInputParams;
	queryConfig?: QueryConfig<typeof getQueryOptions>;
};

export const useLeadsLabelsQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getQueryOptions(params.input),
		...params.queryConfig,
	});
};

export const useSuspenseLeadsLabelsQuery = (
	params: UseOptions
) => {
	return useSuspenseQuery({
		...getQueryOptions(params.input),
		...params.queryConfig,
	});
};
