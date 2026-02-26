import type {ColumnSort, Row, RowData} from "@tanstack/react-table";
import {type CSSProperties} from "react";
import type {DataTableConfig} from "src/config/data-table";
import type {FilterItemSchema} from "src/lib/parsers";

import {type TFilterType, type TFilterOperator} from "@outreachstudio/orpc/util";

declare module "@tanstack/react-table" {
	// biome-ignore lint/correctness/noUnusedVariables: TData is used in the TableMeta interface
	interface TableMeta<TData extends unknown> {
		queryKeys?: QueryKeys;
		getRowStyles?: (row: Row<TData>) => CSSProperties;
	}

	// biome-ignore lint/correctness/noUnusedVariables: TData and TValue are used in the ColumnMeta interface
	// @ts-ignore
	interface ColumnMeta<TData extends RowData, TValue> {
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
}

export interface ExtendedRow<TData> extends Row<TData> {
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

export interface DataTableRowAction<TData> {
	row: Row<TData>;
	variant: "update" | "delete";
}
