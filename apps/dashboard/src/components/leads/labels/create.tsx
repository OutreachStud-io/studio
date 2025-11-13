import React from "react";

import {Button} from "@/components/ui/button";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import {LeadsLabelsCreateUpdateForm} from "@/components/leads/labels/form.tsx";

export function LeadsLabelsCreateDialog(
	{
		onSuccess
	}: {
		onSuccess?: () => void
	}) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size={"sm"} className={"cursor-pointer"}>Create</Button>
			</SheetTrigger>

			<SheetContent className={"max-w-lg! h-full pb-4"}>
				<SheetHeader>
					<SheetTitle>Create a new Label</SheetTitle>
					<SheetDescription>
						Create a new label using the following form
					</SheetDescription>
				</SheetHeader>

				<LeadsLabelsCreateUpdateForm onSuccess={onSuccess}/>
			</SheetContent>
		</Sheet>
	);
}



