import {
	columnFacetingFeature,
	columnFilteringFeature,
	columnOrderingFeature,
	columnPinningFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	createFacetedMinMaxValues,
	createFacetedRowModel,
	createFacetedUniqueValues,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_arrIncludes,
	filterFn_equals,
	filterFn_inDateRange,
	filterFn_includesString,
	filterFn_inNumberRange,
	filterFn_weakEquals,
	metaHelper,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures,
	type ReactTable,
	type RowData,
} from "@tanstack/react-table";

import type {DataTableColumnMeta, DataTableMeta} from "@/types/data-table";

/**
 * Feature registry shared by every table built with `useDataTable`.
 *
 * v9 only exposes an API when its feature is registered here, so this list is
 * the source of truth for what `src/components/data-table/*` may call.
 */
export const dataTableFeatures = tableFeatures({
	columnFacetingFeature,
	columnFilteringFeature,
	columnOrderingFeature,
	columnPinningFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	facetedMinMaxValues: createFacetedMinMaxValues(),
	facetedRowModel    : createFacetedRowModel(),
	facetedUniqueValues: createFacetedUniqueValues(),
	filteredRowModel   : createFilteredRowModel(),
	paginatedRowModel  : createPaginatedRowModel(),
	sortedRowModel     : createSortedRowModel(),
	// the built-ins `filterFn: "auto"` resolves to, by column value type
	filterFns          : {
		arrIncludes   : filterFn_arrIncludes,
		equals        : filterFn_equals,
		inDateRange   : filterFn_inDateRange,
		includesString: filterFn_includesString,
		inNumberRange : filterFn_inNumberRange,
		weakEquals    : filterFn_weakEquals,
	},
	columnMeta         : metaHelper<DataTableColumnMeta>(),
	tableMeta          : metaHelper<DataTableMeta>(),
});

export type DataTableFeatures = typeof dataTableFeatures;

/** The table instance `useDataTable` returns. */
export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;
