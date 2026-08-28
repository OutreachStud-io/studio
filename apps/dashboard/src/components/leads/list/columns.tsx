import React from "react";

import type {DataTableFeatures} from "@/lib/data-table-features";
import LeadESP from "@/components/leads/esp";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {initialsFromName} from "@/lib/utils";

import type {TListOutputResultItem} from "@/tanstack/query/leads/list.ts";


import {type ColumnDef} from "@tanstack/react-table";

import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";

import {DataTableRowActions} from "./row-actions";


export const columns = (sampleItem: TListOutputResultItem): ColumnDef<DataTableFeatures, TListOutputResultItem>[] => {
	return [
		{
			id           : "id",
			size         : 60,
			header       : ({table}) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-[2px]"
				/>
			),
			cell         : ({row}) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-[2px]"
				/>
			),
			enableSorting: false,
			enableHiding : false,
		},
		{
			id                : "email",
			accessorFn        : (row) => row,
			meta              : {
				isGrow        : true,
				filterType    : "string",
				filterOperator: "contains",
				label         : "Email",
				variant       : "text",
			},
			size              : undefined,
			header            : ({column}) => (
				<DataTableColumnHeader column={column} label="Email"/>
			),
			cell              : ({cell}) => {
				const lead = cell.getValue<TListOutputResultItem>();

				if (!lead) {
					return (
						<div className="text-muted-foreground">No lead data</div>
					);
				}

				return (
					<div className="flex items-center space-x-2">
						<div>
							<Avatar className="rounded-lg">
								<AvatarFallback>{initialsFromName(
									`${lead?.firstName || "-"}`, `${lead?.lastName || "-"}`
								)}</AvatarFallback>
							</Avatar>
						</div>
						<div>
							<div className="font-medium">{lead?.firstName || "-"} {lead?.lastName || "-"}</div>
							<div className="text-muted-foreground">{lead?.email}</div>
						</div>
					</div>
				);
			},
			enableSorting     : true,
			enableHiding      : false,
			enableColumnFilter: true,
		},
		{
			id                : "esp",
			accessorFn        : (row) => row,
			size              : 80,
			header            : ({column}) => (
				<DataTableColumnHeader column={column} label="ESP"/>
			),
			cell              : ({cell}) => {
				const lead = cell.getValue<TListOutputResultItem>();

				return (
					<LeadESP className={"cursor-default"} esp={(lead?.esp || "other")}/>
				);
			},
			enableSorting     : false,
			enableHiding      : true,
			enableColumnFilter: true,
		},
		{
			id  : "actions",
			size: 40,
			cell: ({row}) => <DataTableRowActions row={row}/>,
		},
	];
};
