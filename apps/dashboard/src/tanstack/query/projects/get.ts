import {queryOptions, useQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

export type TGetInputParams = Parameters<typeof tanstackClient.projects.get.call>[0];
export type TGetOutputResult = Awaited<ReturnType<typeof tanstackClient.projects.get.call>>;


export const getQueryOptions = (p: TGetInputParams) => {
	return queryOptions({
		queryKey: ['projects', 'get', p],
		queryFn : () => tanstackClient.projects.get.call(p),
	});
};

type UseOptions = {
	input: TGetInputParams;
	queryConfig?: QueryConfig<typeof getQueryOptions>;
};

export const useProjectQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getQueryOptions(params.input),
		...params.queryConfig,
	});
};
