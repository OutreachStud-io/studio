import {
	getRouteApi,
	type RegisteredRouter,
	type RouteIds,
	type SearchParamOptions,
} from "@tanstack/react-router";

import {cleanFiltersEmptyParams} from "@/tanstack/routes/utils.ts";

export function useFilters<
	TId extends RouteIds<RegisteredRouter["routeTree"]>,
	TSearchParams extends SearchParamOptions<
		RegisteredRouter,
		TId,
		TId
	>["search"],
>(routeId: TId) {
	const routeApi = getRouteApi<TId>(routeId);
	const navigate = routeApi.useNavigate();
	const filters = routeApi.useSearch();

	const setFilters = (partialFilters: Partial<TSearchParams>) => {
		navigate({
			search: cleanFiltersEmptyParams({
				...filters,
				...partialFilters,
			}) as TSearchParams,
		});
	};

	const resetFilters = () => navigate({search: {} as TSearchParams});

	return {filters, setFilters, resetFilters};
}
