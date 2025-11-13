import React from "react";

import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm?: () => void;
	onCancel?: () => void;
	title?: string;
	description?: string;

	confirmText?: string;
	cancelText?: string;

	destructive?: boolean;
};

export function ConfirmDialog(
	{
		open,
		onOpenChange,
		onConfirm,
		onCancel,
		title,
		description,
		confirmText,
		cancelText,
		destructive,
		...rest
	}: ConfirmDialogProps & React.ComponentProps<typeof Dialog>) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange} {...rest}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="sm:justify-start">
					<Button variant={description ? "destructive" : "default"} onClick={onConfirm}>
						{confirmText || "Confirm"}
					</Button>

					<DialogClose asChild>
						<Button variant="secondary" onClick={onCancel}>
							{cancelText || "Cancel"}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
