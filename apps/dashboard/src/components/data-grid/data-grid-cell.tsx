"use client";

import type {Cell, RowData, Table} from "@tanstack/react-table";
import * as React from "react";

import type {DataGridFeatures} from "@/lib/data-grid-features";

import {
	CheckboxCell,
	DateCell,
	LongTextCell,
	MultiSelectCell,
	NumberCell,
	SelectCell,
	ShortTextCell,
} from "@/components/data-grid/data-grid-cell-variants";

interface DataGridCellProps<TData extends RowData> {
	cell: Cell<DataGridFeatures, TData, unknown>;
	table: Table<DataGridFeatures, TData>;
}

export function DataGridCell<TData extends RowData>({ cell, table }: DataGridCellProps<TData>) {
	const meta = table.options.meta;
	const originalRowIndex = cell.row.index;

	const rows = table.getRowModel().rows;
	const displayRowIndex = rows.findIndex(
		(row) => row.original === cell.row.original,
	);
	const rowIndex = displayRowIndex >= 0 ? displayRowIndex : originalRowIndex;
	const columnId = cell.column.id;

	const isFocused =
			  meta?.focusedCell?.rowIndex === rowIndex &&
			  meta?.focusedCell?.columnId === columnId;
	const isEditing =
			  meta?.editingCell?.rowIndex === rowIndex &&
			  meta?.editingCell?.columnId === columnId;
	const isSelected = meta?.getIsCellSelected?.(rowIndex, columnId) ?? false;

	const cellOpts = cell.column.columnDef.meta?.cell;
	const variant = cellOpts?.variant ?? "text";

	switch (variant) {
		case "short-text":
			return (
				<ShortTextCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);
		case "long-text":
			return (
				<LongTextCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);
		case "number":
			return (
				<NumberCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);
		case "select":
			return (
				<SelectCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);
		case "multi-select":
			return (
				<MultiSelectCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);
		case "checkbox":
			return (
				<CheckboxCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);
		case "date":
			return (
				<DateCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);

		default:
			return (
				<ShortTextCell
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
				/>
			);
	}
}
