import {CampaignLeadsListPicker} from "@/components/campaigns/campaign/settings/leads/list-picker.tsx";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar.tsx";
import {DataTable} from "@/components/data-table/data-table.tsx";
import {crumbs} from "@/hooks/use-crumbs.ts";
import {useDataTable} from "@/hooks/use-data-table.ts";
import {getCampaignQueryOptions} from "@/tanstack/query/campaigns/get.ts";
import React from "react";

import {useMutation} from "@tanstack/react-query";
import {tanstackClient} from "@/orpc/client.ts";

import {toast} from "sonner";

import {ConfirmDialog} from "@/components/general/confirm.tsx";
import {LeadsLabelsCreateDialog} from "@/components/leads/labels/create.tsx";

import {PageTitleSubtitle} from "@/components/general/page-title-subtitle.tsx";
import {LeadsLabelsUpdateDialog} from "@/components/leads/labels/update.tsx";
import {createFileRoute} from "@tanstack/react-router";

import {useAppStore} from "@/store/app.ts";
import type {TContract} from "@outreachstudio/orpc/contract";

import {useSuspenseLeadsLabelsQuery} from "@/tanstack/query/leads/labels/list.ts";

import {columns} from "@/components/leads/labels/list/columns";

import {AppBar} from "@/components/appbar/bar";
import SidebarLayout from "@/components/sidebar/layout";

export const Route = createFileRoute('/dashboard/leads/labels/')({
	component: Page,
	loader   : async ({params, context, deps}) => {
		return {
			crumbs: crumbs(
				{title: 'Dashboard', link: {to: '/dashboard'}},
				{title: 'Leads', link: {to: '/dashboard/leads'}},
				{
					title: 'Labels'
				}
			),
		};
	},
});

function Page() {
	const appStore = useAppStore();

	const [selectedRecord, setSelectedRecord] = React.useState<TContract["LeadsLabels"]["GetOutput"] | null>(null);
	const [editSheetOpen, setEditSheetOpen] = React.useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

	const {refetch, isLoading, data} = useSuspenseLeadsLabelsQuery({
		input: {
			projectId: `${appStore.selectedProjectId}`
		}
	});

	const delMutation = useMutation(
		tanstackClient.leadsLabels.remove.mutationOptions({})
	);

	const onDelete = (id: string) => {
		toast.promise(
			() =>
				new Promise((resolve) => {
					delMutation.mutate({id}, {
						onSuccess: () => {
							setSelectedRecord(null);
							refetch();
							resolve("");
						},
						onError  : (e) => {
							console.error(e);
							toast.error("There was an error deleting the label. Please try again");
						}
					});
				}),
			{
				loading: "Loading...",
				success: (data) => `The label was successfully deleted`,
				error  : "Error",
			}
		);
	};

	const onSuccess = () => {
		setEditSheetOpen(false);
		toast.success("The label was successfully saved");
		setSelectedRecord(null);
		refetch();
	};

	const {table} = useDataTable({
		data        : data.data || [],
		columns     : columns({
			setSelectedRecord   : setSelectedRecord,
			setEditSheetOpen    : setEditSheetOpen,
			setDeleteConfirmOpen: setDeleteConfirmOpen,
		}),
		pageCount   : 1,
		getRowId    : (row) => row.id,
		history     : "push",
		initialState: {
			pagination: {
				pageIndex: 1,
				pageSize : 1000
			}
		},
	});

	return (
		<SidebarLayout>
			<AppBar
				action={<LeadsLabelsCreateDialog onSuccess={onSuccess}/>}
			/>

			<PageTitleSubtitle
				title={"Leads Labels"}
				showLoading={isLoading}
				description={"Tag your leads with various labels that can also trigger actions"}
			/>

			<DataTable table={table} hideThead={true} hidePagination={true}/>

			{selectedRecord && (
				<LeadsLabelsUpdateDialog
					open={editSheetOpen}
					onOpenChange={setEditSheetOpen}
					record={selectedRecord}
					onSuccess={onSuccess}
				/>
			)}

			<ConfirmDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
				title="Delete label?"
				description="Are you sure you want to delete this label? This action cannot be undone."
				onConfirm={() => {
					setDeleteConfirmOpen(false);
					selectedRecord && onDelete(selectedRecord.id);
				}}
				destructive={true}
			/>
		</SidebarLayout>
	);
}
