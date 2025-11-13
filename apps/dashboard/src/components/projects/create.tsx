import React from "react";

import type {TContract} from "@outreachstudio/orpc/contract";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {ProjectsCreateUpdateForm} from "@/components/projects/form.tsx";

export function ProjectsCreateUpdateDialog(
	{
		onSuccess, trigger, record, open, onOpenChange,
	}: {
		open?: boolean,
		onOpenChange?: (open: boolean) => void,
		onSuccess?: () => void,
		trigger?: React.ReactNode,
		record?: TContract["Projects"]["GetOutput"]
	}) {
	return (
		<Dialog modal={true} open={open} onOpenChange={onOpenChange}>
			{open === undefined && (/* state is controlled so we don't need the trigger? */
				<DialogTrigger asChild>
					{trigger}
				</DialogTrigger>
			)}

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{record ? "Update Project" : "Create a new project"}
					</DialogTitle>
				</DialogHeader>

				<ProjectsCreateUpdateForm onSuccess={onSuccess} record={record}/>
			</DialogContent>
		</Dialog>
	);
}



