import {ScrollArea} from "@/components/ui/scroll-area-custom.tsx";
import React from "react";

import {LeadsListsList} from "@/components/leads/lists/list.tsx";
import Stats01 from "@/components/leads/lists/stats.tsx";
import {crumbs} from "@/hooks/use-crumbs.ts";


import {useMutation} from "@tanstack/react-query";
import {tanstackClient} from "@/orpc/client.ts";

import {toast} from "sonner";

import {ConfirmDialog} from "@/components/general/confirm.tsx";
import {LeadsLabelsCreateDialog} from "@/components/leads/labels/create.tsx";

import {createFileRoute} from "@tanstack/react-router";

import {useAppStore} from "@/store/app.ts";

import {useSuspenseLeadsListsListQuery, type TListOutputResultItem} from "@/tanstack/query/leads/lists/list.ts";

import {AppBar} from "@/components/appbar/bar";
import SidebarLayout from "@/components/sidebar/layout";

export const Route = createFileRoute('/dashboard/leads/lists/')({
	component: Page,
	loader   : async ({params, context, deps}) => {
		return {
			crumbs: crumbs(
				{title: 'Dashboard', link: {to: '/dashboard'}},
				{title: 'Leads', link: {to: '/dashboard/leads'}},
				{
					title: "Lists"
				}
			),
		};
	},
});

function Page() {
	const appStore = useAppStore();

	const [selectedRecord, setSelectedRecord] = React.useState<TListOutputResultItem | null>(null);
	const [editSheetOpen, setEditSheetOpen] = React.useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

	const {refetch, isLoading, data} = useSuspenseLeadsListsListQuery({
		input: {
			projectId: `${appStore.selectedProjectId}`
		}
	});

	const delMutation = useMutation(
		tanstackClient.leadsLists.remove.mutationOptions({})
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

			<div className="border-b">
				<Stats01/>
			</div>

			<ScrollArea>
				<LeadsListsList
					lists={data}
				/>
			</ScrollArea>

			{/*{selectedRecord && (*/}
			{/*	<LeadsLabelsUpdateDialog*/}
			{/*		open={editSheetOpen}*/}
			{/*		onOpenChange={setEditSheetOpen}*/}
			{/*		record={selectedRecord}*/}
			{/*		onSuccess={onSuccess}*/}
			{/*	/>*/}
			{/*)}*/}

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
