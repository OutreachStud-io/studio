import type {ColumnPinningPosition} from "@tanstack/react-table";
import {dataTableConfig} from "src/config/data-table";
import type {
	ExtendedColumnFilter,
	FilterOperator,
	FilterVariant,
} from "src/types/data-table";

/**
 * The column APIs {@link getCommonPinningStyles} needs, which a table only
 * exposes once it registers `columnPinningFeature`, `columnSizingFeature` and
 * `columnOrderingFeature`. Kept structural so both the data-table and the
 * data-grid feature sets can pass their own columns.
 */
type PinnableColumn = {
	getIsPinned: () => ColumnPinningPosition;
	getIsFirstColumn: (position?: ColumnPinningPosition | "center") => boolean;
	getIsLastColumn: (position?: ColumnPinningPosition | "center") => boolean;
	getStart: (position?: ColumnPinningPosition | "center") => number;
	getAfter: (position?: ColumnPinningPosition | "center") => number;
	getSize: () => number;
};

export function getCommonPinningStyles(
	{
		column,
		withBorder = false,
	}: {
		column: PinnableColumn;
		withBorder?: boolean;
	}): React.CSSProperties {
	const isPinned = column.getIsPinned();
	const isLastStartPinnedColumn =
			  isPinned === "start" && column.getIsLastColumn("start");
	const isFirstEndPinnedColumn =
			  isPinned === "end" && column.getIsFirstColumn("end");

	return {
		boxShadow      : withBorder
			? isLastStartPinnedColumn
				? "-4px 0 4px -4px var(--border) inset"
				: isFirstEndPinnedColumn
					? "4px 0 4px -4px var(--border) inset"
					: undefined
			: undefined,
		insetInlineStart: isPinned === "start" ? `${column.getStart("start")}px` : undefined,
		insetInlineEnd  : isPinned === "end" ? `${column.getAfter("end")}px` : undefined,
		opacity         : isPinned ? 0.97 : 1,
		position        : isPinned ? "sticky" : "relative",
		background      : isPinned ? "var(--background)" : "var(--background)",
		width           : column.getSize(),
		zIndex          : isPinned ? 1 : undefined,
	};
}

export function getFilterOperators(filterVariant: FilterVariant) {
	const operatorMap: Record<
		FilterVariant,
		{ label: string; value: FilterOperator }[]
	> = {
		text       : dataTableConfig.textOperators,
		number     : dataTableConfig.numericOperators,
		range      : dataTableConfig.numericOperators,
		date       : dataTableConfig.dateOperators,
		dateRange  : dataTableConfig.dateOperators,
		boolean    : dataTableConfig.booleanOperators,
		select     : dataTableConfig.selectOperators,
		multiSelect: dataTableConfig.multiSelectOperators,
	};

	return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
	const operators = getFilterOperators(filterVariant);

	return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

export function getValidFilters<TData>(
	filters: ExtendedColumnFilter<TData>[],
): ExtendedColumnFilter<TData>[] {
	return filters.filter(
		(filter) =>
			filter.operator === "isEmpty" ||
			filter.operator === "isNotEmpty" ||
			(Array.isArray(filter.value)
				? filter.value.length > 0
				: filter.value !== "" &&
				filter.value !== null &&
				filter.value !== undefined),
	);
}
