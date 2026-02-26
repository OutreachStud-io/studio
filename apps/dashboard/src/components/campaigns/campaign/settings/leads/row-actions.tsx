import {type Row} from "@tanstack/react-table";
import {MoreHorizontal} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>(
	{
		row,
	}: DataTableRowActionsProps<TData>
) {
	//const task = campaignLeadSchema.parse(row.original.campaignLead);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex size-6 p-0! m-0! data-[state=open]:bg-muted"
				>
					<MoreHorizontal/>
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem>Mark as completed</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
