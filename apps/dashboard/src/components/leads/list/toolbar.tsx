import Label from "@/components/leads/labels/label.tsx";
import {type Table} from "@tanstack/react-table";
import {X} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";


import {useAppStore} from "@/store/app.ts";
import {useLeadsLabelsQuery} from "@/tanstack/query/leads/labels/list.ts";

import {sequences} from "./data";
import {DataTableFacetedFilter} from "@/components/general/data-table/faceted-filter";
import {DataTableViewOptions} from "@/components/general/data-table/view-options";

import {schema} from "@outreachstudio/orpc/schema";

interface LeadsListToolbarProps<TData> {
	table: Table<TData>;
}

export function LeadsListToolbar<TData>(
	{
		table,
	}: LeadsListToolbarProps<TData>
) {
	const appStore = useAppStore();
	const leadLabels = useLeadsLabelsQuery({
		input: {
			projectId : `${appStore.selectedProjectId}`,
			pagination: {
				limit: 100,
			},
		},
	});
	const isFiltered = table.getState().columnFilters.length > 0;

	const statusColumn = table.getColumn("status");
	const sequencesCountColumn = table.getColumn("sequence");
	const labelColumn = table.getColumn("label");

	return (
		<div className="flex items-center justify-between px-2 border-b py-4 m-0">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter leads..."
					value={(table.getColumn("lead")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("lead")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>

				<DataTableFacetedFilter
					column={statusColumn}
					title="Status"
					options={
						Array.from(
							schema.campaignsLeads.select.shape.status.options
						).map(status => ({
							value: status,
							label: status.charAt(0).toUpperCase() + status.slice(1)
						}))
					}
				/>

				<DataTableFacetedFilter
					column={sequencesCountColumn}
					title="Sequence"
					options={sequences}
				/>

				<DataTableFacetedFilter
					column={labelColumn}
					title="Label"
					options={
						leadLabels.data?.data.map(
							(label) => ({
								value: label.id,
								label: <Label label={label}/>
							})
						) || []
					}
				/>

				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X/>
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table}/>
		</div>
	);
}
