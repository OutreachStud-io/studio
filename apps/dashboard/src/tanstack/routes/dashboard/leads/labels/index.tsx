import React from "react";

import {useMutation} from "@tanstack/react-query";
import {tanstackClient} from "@/orpc/client.ts";

import {toast} from "sonner";

import {ConfirmDialog} from "@/components/general/confirm.tsx";
import {TableSkeleton} from "@/components/general/skeletons.tsx";
import {LeadsLabelsCreateDialog} from "@/components/leads/labels/create.tsx";

import {PageTitleSubtitle} from "@/components/general/page-title-subtitle.tsx";
import {LeadsLabelsUpdateDialog} from "@/components/leads/labels/update.tsx";
import {createFileRoute} from "@tanstack/react-router";

import {useAppStore} from "@/store/app.ts";
import type {TContract} from "@outreachstudio/orpc/contract";

import {useLeadsLabelsQuery} from "@/tanstack/query/leads/labels/list.ts";

import LeadsLabelsList, {type RowEnhancer} from "@/components/general/data-table/list";
import {columns} from "@/components/leads/labels/list/columns";

import {AppBar} from "@/components/appbar/bar";
import SidebarLayout from "@/components/sidebar/layout";

export const Route = createFileRoute('/dashboard/leads/labels/')({
	component: Page,
});

function Page() {
	const appStore = useAppStore();

	const [selectedRecord, setSelectedRecord] = React.useState<TContract["LeadsLabels"]["ShowOutput"] | null>(null);
	const [editSheetOpen, setEditSheetOpen] = React.useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

	const {refetch, isLoading, data} = useLeadsLabelsQuery({
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

			{isLoading && <TableSkeleton className={"m-6"}/>}

			{!isLoading && (
				<LeadsLabelsList<TContract["LeadsLabels"]["ShowOutput"] & RowEnhancer>
					data={data?.data || []}
					columns={columns({
						setSelectedRecord   : setSelectedRecord,
						setEditSheetOpen    : setEditSheetOpen,
						setDeleteConfirmOpen: setDeleteConfirmOpen,
					})}
					options={{
						hideThead                 : true,
						hidePaginationIfSinglePage: true,
					}}
				/>
			)}

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
