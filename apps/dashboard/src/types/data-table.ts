import type {ColumnSort, Row, RowData} from "@tanstack/react-table";
import type {DataTableConfig} from "src/config/data-table";
import type {FilterItemSchema} from "src/lib/parsers";

import {type TFilterType, type TFilterOperator} from "@outreachstudio/orpc/util";

import type {DataTableFeatures} from "@/lib/data-table-features";

export interface DataTableMeta {
	queryKeys?: QueryKeys;
}

export interface DataTableColumnMeta {
	label?: string;
	placeholder?: string;
	variant?: FilterVariant;
	options?: Option[];
	range?: [number, number];
	unit?: string;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	isGrow?: boolean;
	widthPercentage?: number;
	filterType?: TFilterType;
	filterOperator?: TFilterOperator;
}

export interface ExtendedRow<TData extends RowData> extends Row<DataTableFeatures, TData> {
	cosmetics?: {
		striped?: boolean;
	};
}


export interface QueryKeys {
	page: string;
	perPage: string;
	sort: string;
	filters: string;
	joinOperator: string;
}

export interface Option {
	label: string;
	value: string;
	count?: number;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	className?: string;
	iconClassName?: string;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
	id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
	id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData extends RowData> {
	row: Row<DataTableFeatures, TData>;
	variant: "update" | "delete";
}
