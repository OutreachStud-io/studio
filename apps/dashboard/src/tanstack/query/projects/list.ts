import {queryOptions, useQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

export type TListInputParams = Parameters<typeof tanstackClient.projects.list.call>[0];
export type TListOutputResult = Awaited<ReturnType<typeof tanstackClient.projects.list.call>>;


export const getQueryOptions = (p: TListInputParams) => {
	return queryOptions({
		queryKey: ['projects', 'list', p],
		queryFn : () => tanstackClient.projects.list.call(p),
	});
};

type UseOptions = {
	input: TListInputParams;
	queryConfig?: QueryConfig<typeof getQueryOptions>;
};

export const useProjectsQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getQueryOptions(params.input),
		...params.queryConfig,
	});
};
