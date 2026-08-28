"use client";

import type {RowData, Table} from "@tanstack/react-table";
import {
	AlignVerticalSpaceAroundIcon,
	ChevronsDownUpIcon,
	EqualIcon,
	MinusIcon,
} from "lucide-react";
import * as React from "react";

import type {DataGridFeatures} from "@/lib/data-grid-features";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "src/components/ui/select";

const rowHeights = [
	{
		label: "Short",
		value: "short" as const,
		icon : MinusIcon,
	},
	{
		label: "Medium",
		value: "medium" as const,
		icon : EqualIcon,
	},
	{
		label: "Tall",
		value: "tall" as const,
		icon : AlignVerticalSpaceAroundIcon,
	},
	{
		label: "Extra Tall",
		value: "extra-tall" as const,
		icon : ChevronsDownUpIcon,
	},
] as const;

interface DataGridRowHeightMenuProps<TData extends RowData>
	extends React.ComponentProps<typeof SelectContent> {
	table: Table<DataGridFeatures, TData>;
}

export function DataGridRowHeightMenu<TData extends RowData>({
												 table,
												 ...props
											 }: DataGridRowHeightMenuProps<TData>) {
	const rowHeight = table.options.meta?.rowHeight;
	const onRowHeightChange = table.options.meta?.onRowHeightChange;

	const selectedRowHeight = React.useMemo(() => {
		return (
			rowHeights.find((opt) => opt.value === rowHeight) ?? {
				label: "Short",
				value: "short" as const,
				icon : MinusIcon,
			}
		);
	}, [rowHeight]);

	return (
		<Select value={rowHeight} onValueChange={onRowHeightChange}>
			<SelectTrigger size="sm" className="[&_svg:nth-child(2)]:hidden">
				<SelectValue placeholder="Row height">
					<selectedRowHeight.icon/>
					{selectedRowHeight.label}
				</SelectValue>
			</SelectTrigger>
			<SelectContent {...props}>
				{rowHeights.map((option) => {
					const OptionIcon = option.icon;
					return (
						<SelectItem key={option.value} value={option.value}>
							<OptionIcon className="size-4"/>
							{option.label}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
