import {
	columnOrderingFeature,
	columnPinningFeature,
	columnResizingFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	createSortedRowModel,
	metaHelper,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_basic,
	sortFn_datetime,
	sortFn_text,
	tableFeatures,
	type ReactTable,
	type RowData,
} from "@tanstack/react-table";

import type {DataGridColumnMeta, DataGridMeta} from "@/types/data-grid";

/**
 * Feature registry shared by every grid built with `useDataGrid`.
 *
 * v9 only exposes an API when its feature is registered here, so this list is
 * the source of truth for what `src/components/data-grid/*` may call. The
 * registered `sortFns` are the ones `sortFn: "auto"` resolves to.
 */
export const dataGridFeatures = tableFeatures({
	columnOrderingFeature,
	columnPinningFeature,
	columnSizingFeature,
	columnResizingFeature,
	columnVisibilityFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns       : {
		alphanumeric: sortFn_alphanumeric,
		basic       : sortFn_basic,
		datetime    : sortFn_datetime,
		text        : sortFn_text,
	},
	columnMeta    : metaHelper<DataGridColumnMeta>(),
	tableMeta     : metaHelper<DataGridMeta>(),
});

export type DataGridFeatures = typeof dataGridFeatures;

/** The table instance `useDataGrid` returns. */
export type DataGridInstance<TData extends RowData> = ReactTable<DataGridFeatures, TData>;
