import {sortersFromString} from "@/hooks/use-data-table.ts";
import type {DataTableFeatures} from "@/lib/data-table-features";
import {
	getRouteApi,
	type RegisteredRouter,
	type RouteIds,
} from "@tanstack/react-router";

import {type ColumnDef} from "@tanstack/react-table";
import {type TSortSchema} from "@outreachstudio/orpc/util";


export function useTableRouteSorters<
	TData,
	TId extends RouteIds<RegisteredRouter["routeTree"]>,
>(
	routeId: TId,
	columns: ColumnDef<DataTableFeatures, any>[]
) {
	const search = getRouteApi<TId>(routeId).useSearch();

	const sort: TSortSchema["sort"] = [];

	const sortableColumns = columns
		.filter((col) => col.enableSorting)
		.map(
			(col) => col.id || "",
		);

	sortableColumns.forEach((columnId) => {
		const s = (search as any)["sort"] as string | undefined;
		const value = sortersFromString<TData>(s || "");

		if (value !== undefined && value !== null) {
			// since value is an array, find the field sort based on column id, if any
			const record = value.filter((column) => column.id === columnId);

			if (record.length > 0) {
				sort.push({
					field: columnId,
					type : record[0]?.desc ? "desc" : "asc",
				});
			}
		}
	});

	return {sort};
}
