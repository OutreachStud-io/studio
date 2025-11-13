import React from "react";

import {Tag} from "lucide-react";
import LeadESP from "@/components/leads/esp";
import LeadLabel, {labelTextColor} from "@/components/leads/labels/label";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {type Option} from "@/types/data-table";
import LeadStatus, {statuses} from "@/components/leads/status";
import {Progress} from "@/components/ui/progress";
import {initialsFromName} from "@/lib/utils";

import type {TListOutputResult} from "@/tanstack/query/leads/labels/list.ts";
import type {TListOutputResultItem} from "@/tanstack/query/campaigns/leads/list.ts";


import {type ColumnDef} from "@tanstack/react-table";

import {Checkbox} from "@/components/ui/checkbox";

import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";

import {DataTableRowActions} from "./row-actions";

type TCampaignLeadsColumnsProps = {
	sequencesTotal: number;
	labels: TListOutputResult["data"];
}

export const columns = (p: TCampaignLeadsColumnsProps): ColumnDef<TListOutputResultItem>[] => {
	return [
		{
			id           : "select",
			size         : 40,
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
			id                : "lead.email",
			accessorFn        : (row) => row.lead,
			meta              : {
				isGrow        : true,
				filterType    : "string",
				filterOperator: "contains",
				label         : "Lead",
				variant       : "text",
			},
			size              : undefined,
			header            : ({column}) => (
				<DataTableColumnHeader column={column} label="Lead"/>
			),
			cell              : ({row}) => {
				const cData = row.getValue<TListOutputResultItem["lead"]>("lead.email");

				if (!cData) {
					return (
						<div className="text-muted-foreground">No lead data</div>
					);
				}

				return (
					<div className="flex items-center space-x-2">
						<div>
							<Avatar className="rounded-lg">
								<AvatarFallback>{initialsFromName(
									`${cData?.firstName}`, `${cData?.lastName}`
								)}</AvatarFallback>
							</Avatar>
						</div>
						<div>
							<div className="font-medium">{cData?.firstName} {cData?.lastName}</div>
							<div className="text-muted-foreground">{cData?.email}</div>
						</div>
					</div>
				);
			},
			enableSorting     : true,
			enableHiding      : false,
			enableColumnFilter: true,
		},
		{
			id                : "lead.esp",
			accessorFn        : (row) => row.lead,
			size              : 80,
			header            : ({column}) => (
				<DataTableColumnHeader column={column} label="ESP"/>
			),
			cell              : ({cell}) => {
				const lead = cell.getValue<TListOutputResultItem["lead"]>();

				return (
					<LeadESP className={"cursor-default"} esp={(lead?.esp || "other")}/>
				);
			},
			enableSorting     : false,
			enableHiding      : true,
			enableColumnFilter: true,
		},
		{
			id                : "status",
			accessorFn        : (row) => row.status,
			meta              : {
				widthPercentage: 25,
				label          : "Status",
				variant        : "multiSelect",
				options        : statuses.map((s) => ({
					...s, className: "", iconClassName: s.className,
				})) as Option[],
				filterType     : "list",
				filterOperator : "in",
			},
			size              : undefined,
			maxSize           : 220,
			minSize           : 100,
			header            : ({column}) => (
				<DataTableColumnHeader column={column} label="Status"/>
			),
			cell              : ({row}) => {
				return row.original.status ? (
					<div className="flex space-x-2">
						<LeadStatus status={row.original.status}/>
					</div>
				) : (
					<div className="text-muted-foreground">No status</div>
				);
			},
			enableSorting     : true,
			enableHiding      : true,
			enableColumnFilter: true,
		},
		{
			id                : "sequences",
			accessorFn        : (row) => row.sequences?.count,
			meta              : {
				widthPercentage: 25,
				label          : "Sequence",
				variant        : "range",
				range          : [0, p.sequencesTotal],
			},
			size              : undefined,
			maxSize           : 220,
			minSize           : 100,
			header            : ({column}) => (
				<DataTableColumnHeader column={column} label="Sequence"/>
			),
			cell              : ({row}) => {
				const sequencesCount = row.original.sequences?.count || 0;
				const sequencesTotal = row.original.sequences?.total || 0;

				return (
					<div className="flex items-center gap-1 max-w-[100px]">
						<Progress value={sequencesCount / sequencesTotal * 100} className={"h-[6px] opacity-50"}/>
						<p className={"text-xs text-muted-foreground"}>{sequencesCount} of {sequencesTotal}</p>
					</div>
				);
			},
			enableSorting     : true,
			enableHiding      : true,
			enableColumnFilter: true,
		},
		{
			id                : "label",
			accessorFn        : (row) => row.label,
			meta              : {
				widthPercentage: 25,
				label          : "Label",
				variant        : "multiSelect",

				options: p.labels.map((label) => ({
					value        : label.id,
					label        : label.name,
					icon         : Tag,
					iconClassName: labelTextColor(label.type),
				})) as Option[],
			},
			size              : undefined,
			maxSize           : 220,
			minSize           : 100,
			header            : ({column}) => (
				<DataTableColumnHeader column={column} label="Label"/>
			),
			cell              : ({row}) => {
				const label = row.original.label;

				return label ? (
					<div className="flex items-center">
						<LeadLabel label={label}/>
					</div>
				) : (
					<div className="text-muted-foreground">No label</div>
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
