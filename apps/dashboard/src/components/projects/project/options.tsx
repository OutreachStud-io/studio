import React from "react";

import {useMutation} from "@tanstack/react-query";
import {tanstackClient} from "@/orpc/client.ts";
import {EllipsisVertical, Trash, Archive} from "lucide-react";

import {toast} from "sonner";
import {ConfirmDialog} from "@/components/general/confirm.tsx";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {TGetOutputResult} from "@/tanstack/query/projects/get.ts";


export function ProjectOptions(
	{project, onDeleteCb}: {
		project: TGetOutputResult;
		onDeleteCb?: () => void;
	}) {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
	const [dropdownOpen, setDropdownOpen] = React.useState(false);
	const [selectedRecord, setSelectedRecord] = React.useState<TGetOutputResult | null>(null);

	const delMutation = useMutation(
		tanstackClient.projects.remove.mutationOptions({})
	);

	const onDelete = () => {
		toast.promise(
			() =>
				new Promise((resolve) => {
					delMutation.mutate({id: project.id}, {
						onSuccess: () => {
							onDeleteCb?.();
							resolve("");
						},
						onError  : (e) => {
							console.error(e);
							toast.error("There was an error deleting the project. Please try again");
						}
					});
				}),
			{
				loading: "Loading...",
				success: (data) => `The project was successfully deleted`,
				error  : "Error",
			}
		);
	};

	return (
		<>
			<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<EllipsisVertical className={"size-4"}/>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Options</DropdownMenuLabel>
					<DropdownMenuSeparator/>

					<DropdownMenuItem>
						<Archive className={"size-3"}/> Archive
					</DropdownMenuItem>

					<DropdownMenuItem
						className={"text-destructive"}
						onSelect={() => {
							setDropdownOpen(false);
							setDeleteConfirmOpen(true);
						}}
					>
						<Trash className={"size-3 text-destructive"}/> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
				title="Delete project?"
				description="Are you sure you want to delete this project? All the campaigns and related objects will also be deleted! This action cannot be undone."
				onConfirm={() => {
					setDeleteConfirmOpen(false);
					onDelete();
				}}
				destructive={true}
			/>
		</>
	);
}
