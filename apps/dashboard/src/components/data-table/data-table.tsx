import React from "react";

import {debounce} from "remeda";

import {
	flexRender,
	type Table as TanstackTable,
} from "@tanstack/react-table";

import {DataTablePagination} from "src/components/data-table/data-table-pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "src/components/ui/table";
import {getCommonPinningStyles} from "src/lib/data-table";
import {calculateTableSizing, cn} from "src/lib/utils";
import type {ExtendedRow} from "@/types//data-table";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
	table: TanstackTable<TData>;
	actionBar?: React.ReactNode;
	hidePagination?: boolean;
	hideThead?: boolean;
}

export function DataTable<TData>(
	{
		table,
		actionBar,
		hideThead,
		hidePagination,
		children,
		className,
		...props
	}: DataTableProps<TData>) {
	const headers = table.getFlatHeaders();
	const tableContainerRef = React.useRef<HTMLTableElement>(null);

	// https://github.com/TanStack/table/discussions/3192
	React.useLayoutEffect(() => {
		if (!tableContainerRef.current) return;

		const debouncedResize = debounce((width: number) => {
			const newSizing = calculateTableSizing(headers, width);

			const currentSizing = table.getState().columnSizing;
			const hasChanged = Object.keys(newSizing).some(
				(key) => newSizing[key] !== currentSizing[key],
			);

			if (hasChanged) {
				table.setColumnSizing(newSizing);
			}
		}, {
			waitMs: 150
		});

		const resizeObserver = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				debouncedResize.call(entry.contentRect.width);
			}
		});

		resizeObserver.observe(tableContainerRef.current);

		return () => {
			resizeObserver.disconnect();
			debouncedResize.cancel?.(); // cancel pending debounced calls on unmount
		};
	}, [headers, table]);

	return (
		<div
			className={cn("h-full flex w-full flex-col gap-2.5 overflow-auto", className)}
			{...props}
		>
			{children}
			<div className="overflow-hidden flex-1">
				<Table ref={tableContainerRef}>
					{!hideThead && (
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => {
								const heads = headerGroup.headers;

								return (
									<TableRow key={headerGroup.id}>
										{heads.map((header, i) => (
											<TableHead
												key={header.id}
												colSpan={header.colSpan}

												style={{
													...getCommonPinningStyles({column: header.column}),
													width: header.getSize(),
												}}

												className={cn(
													i === 0 && "pl-6!",
													i === heads.length - 1 && "pr-6!"
												)}
											>
												{header.isPlaceholder
													? null
													: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
											</TableHead>
										))}
									</TableRow>
								);
							})}
						</TableHeader>
					)}
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => {
								const cells = row.getVisibleCells();

								return (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className={cn(
											(row.original as ExtendedRow<TData>)?.cosmetics?.striped ? "pattern-grid" : ""
										)}
									>
										{cells.map((cell, i) => (
											<TableCell
												key={cell.id}
												style={{
													...getCommonPinningStyles({column: cell.column}),
												}}
												className={cn(
													i === 0 && "pl-6!",
													i === cells.length - 1 && "pr-6!"
												)}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={table.getAllColumns().length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{!hidePagination && (
				<div className="flex flex-col gap-2.5 px-6 mt-4">
					<DataTablePagination table={table}/>
					{actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
				</div>
			)}
		</div>
	);
}
