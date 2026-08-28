import {type Row, type RowData} from "@tanstack/react-table";
import {MoreHorizontal} from "lucide-react";

import type {DataTableFeatures} from "@/lib/data-table-features";
import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData extends RowData> {
	row: Row<DataTableFeatures, TData>;
	onEdit?: (data: TData) => void;
	onDelete?: (data: TData) => void;
}

export function DataTableRowActions<TData extends RowData>(
	{
		row,
		onEdit,
		onDelete,
	}: DataTableRowActionsProps<TData>
) {
	// modal false - otherwise the page will lose it's events and functionality after closing the sheet
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<MoreHorizontal/>
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem
					onSelect={() => {
						onEdit && onEdit(row.original);
					}}
				>Edit</DropdownMenuItem>

				<DropdownMenuSeparator/>

				<DropdownMenuItem
					onSelect={() => {
						onDelete && onDelete(row.original);
					}}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
