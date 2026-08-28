import React from "react";

import type {TContract} from "@outreachstudio/orpc/contract";
import {type ColumnDef} from "@tanstack/react-table";

import Label from "@/components/leads/labels/label.tsx";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";

import {DataTableRowActions} from "./row-actions";


export const columns: (
	p: {
		setSelectedRecord: React.Dispatch<React.SetStateAction<TContract["LeadsLabels"]["GetOutput"] | null>>;
		setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
		setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
	}
) => ColumnDef<TContract["LeadsLabels"]["GetOutput"]> [] = (p) => {
	return [
		{
			id           : "name",
			meta         : {
				isGrow: true,
			},
			size         : undefined,
			header       : ({column}) => (
				<DataTableColumnHeader column={column} label="Name"/>
			),
			accessorFn   : (row) => row.name,
			cell         : ({row}) => {
				return (
					<div className="flex items-center space-x-2 overflow-hidden">
						<Label label={row.original}/>

						<div className="hidden lg:block text-xs text-muted-foreground text-nowrap max-w-[1px]">
							{row.original.description}
						</div>
					</div>
				);
			},
			enableSorting: false,
			enableHiding : false,
		},
		{
			id  : "actions",
			size: 40,
			cell: ({row}) => {
				return (
					<div className={"pr-4"}>
						<DataTableRowActions
							row={row}
							onEdit={(row) => {
								p.setSelectedRecord(row);
								p.setEditSheetOpen(true);
							}}
							onDelete={(row) => {
								p.setSelectedRecord(row);
								p.setDeleteConfirmOpen(true);
							}}
						/>
					</div>
				);
			},
		},
	];
};
