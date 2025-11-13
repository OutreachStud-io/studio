import React from "react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import type {TContract} from "@outreachstudio/orpc/contract";

import {LeadsLabelsCreateUpdateForm} from "@/components/leads/labels/form.tsx";

export function LeadsLabelsUpdateDialog({open, onOpenChange, onSuccess, record}: {
	open: boolean,
	onOpenChange: (open: boolean) => void,
	onSuccess?: () => void,
	record: TContract["LeadsLabels"]["ShowOutput"]
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className={"max-w-lg! h-full pb-4"}>
				<SheetHeader>
					<SheetTitle>Update Label</SheetTitle>
					<SheetDescription>
						Update the details for this lead label.
					</SheetDescription>
				</SheetHeader>

				<LeadsLabelsCreateUpdateForm onSuccess={onSuccess} record={record}/>
			</SheetContent>
		</Sheet>
	);
}



