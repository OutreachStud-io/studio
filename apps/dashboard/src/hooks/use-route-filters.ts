import {
	getRouteApi,
	type RegisteredRouter,
	type RouteIds,
} from "@tanstack/react-router";

import {type ColumnDef, type RowData} from "@tanstack/react-table";
import {type TFilterSchema} from "@outreachstudio/orpc/util";

import type {DataTableFeatures} from "@/lib/data-table-features";


/**
 * Hook to extract filters from route search params based on table columns
 * so we can pass them ahead to the API call
 *
 * @param routeId tanstack route id
 * @param columns table columns
 * @returns object containing the filters array
 */
export function useTableRouteFilters<TData extends RowData, TId extends RouteIds<RegisteredRouter["routeTree"]>>(
	routeId: TId,
	columns: ColumnDef<DataTableFeatures, any>[],
) {
	const search = getRouteApi<TId>(routeId).useSearch();
	const filter: TFilterSchema["filter"] = [];

	type TFilterMapping = Record<string, TFilterSchema["filter"][number]>

	const filterMapping: Partial<TFilterMapping> = columns
		.filter((c) => c.enableColumnFilter)
		.reduce((acc, c) => ({
			...acc,
			[c.id || ``]: {
				type    : c.meta?.filterType || "list",
				operator: c.meta?.filterOperator || "contains",
			}
		}), {});

	const filterableColumns = columns
		.filter((col) => col.enableColumnFilter)
		.map((col) => col.id as string);

	filterableColumns.forEach((columnId) => {
		const value = (search as any)[columnId];

		if (value !== undefined && value !== null && value !== '') {
			const mapping = filterMapping[columnId];
			filter.push({
				field   : columnId,
				operator: mapping?.operator || "contains",
				type    : (mapping?.type ?? "string"),
				value,
			});
		}
	});

	// Cast on return if needed for compatibility
	return {filter};
}
