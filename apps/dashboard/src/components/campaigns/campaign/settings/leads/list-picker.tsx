import type {TGetOutputResult} from "@/tanstack/query/projects/get.ts";
import React from "react";

import {LoaderCircleIcon} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {ConfirmDialog} from "@/components/general/confirm.tsx";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import {friendlyNumber} from "@/lib/utils.ts";
import {tanstackClient} from "@/orpc/client.ts";

import {useSuspenseCampaignLeadsListsQuery} from "@/tanstack/query/campaigns/leads_lists/list.ts";

export function CampaignLeadsListPicker(
	{campaignId}: { campaignId: string }
) {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
	const [selectedRecord, setSelectedRecord] = React.useState<string | null>(null);

	const leadsListsQuery = useSuspenseCampaignLeadsListsQuery({
		input: {
			campaignId,
			paginate: {
				limit: 100
			},
			expand  : ["list", "campaign", "counts"]
		}
	});

	const createMutation = useMutation(tanstackClient.campaignsLeadsLists.create.mutationOptions({}));
	const deleteMutation = useMutation(
		tanstackClient.campaignsLeadsLists.remove.mutationOptions({})
	);

	const onAdd = (id: string) => {
		toast.promise(
			() =>
				new Promise((resolve) => {
					createMutation.mutate({
						campaignId, listId: id,
					}, {
						onError  : (e) => {
							resolve(true);
							console.error(e);
							toast.error("There was an error adding the list. Please try again", {
								dismissible: true,
								duration   : 5000,
							});
						},
						onSuccess: () => {
							resolve(true);
							leadsListsQuery.refetch();
						}
					},);
				}),
			{
				loading    : "Loading...",
				success    : (data) => `The list was successfully added`,
				error      : "Error",
				dismissible: true,
				duration   : 5000,
			}
		);
	};

	const onRemove = () => {
		toast.promise(
			() =>
				new Promise((resolve) => {
					deleteMutation.mutate({id: selectedRecord, campaignId}, {
						onSuccess: () => {
							leadsListsQuery.refetch();
							resolve("");
						},
						onError  : (e) => {
							console.error(e);
							toast.error("There was an error removing the list. Please try again");
						}
					});
				}),
			{
				loading: "Loading...",
				success: (data) => `The list was successfully removed`,
				error  : "Error",
			}
		);
	};

	if (leadsListsQuery.isLoading) {
		return <Button disabled size={"sm"}>
			<LoaderCircleIcon className="-ms-1 animate-spin" size="16"/>
			Lists
		</Button>;
	}

	return (
		<>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						size="sm"
						className="border-dashed"
						variant={"ghost"}
					>
						<span
							className="inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.7rem] font-medium text-muted-foreground">
							{leadsListsQuery.data.data.length}
						</span>
						Lists
					</Button>
				</SheetTrigger>
				<SheetContent className={"w-5xl! max-w-lg!"}>
					<SheetHeader className={"p-0 m-0"}>
						<div className="px-4 py-4 pb-3">
							<SheetTitle>Lead lists</SheetTitle>
							<SheetDescription>
								Select the desired lists to serve as lead sources for this campaign.
							</SheetDescription>
						</div>
						<Separator className={"m-0 mb-2"}/>
					</SheetHeader>
					<div className="grid flex-1 auto-rows-min gap-8 px-4">
						{leadsListsQuery.data.data.map((list) => (
							<div key={list.id} className="flex items-start gap-3">
								<Switch
									id={list.id}
									checked={list.selected}
									onCheckedChange={(checked) => {
										if (checked) {
											onAdd(list.id);
										} else {
											setSelectedRecord(list.id);
											setDeleteConfirmOpen(true);
										}
									}}
								/>

								<div className="flex flex-col gap-1">
									<Label htmlFor={list.id}>{list.list?.name}</Label>

									<p className="text-xs text-muted-foreground">
										{friendlyNumber(list.counts?.leads ?? 0)} leads in this list,
										used in {(list.counts?.campaigns || 0) - (list.selected ? 1 : 0)} other
										campaigns
									</p>
								</div>
							</div>
						))}
					</div>
					<SheetFooter>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>

			<ConfirmDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
				title="Remove list?"
				description="Please confirm you want to remove this list"
				onConfirm={() => {
					setDeleteConfirmOpen(false);
					onRemove();
				}}
				destructive={true}
			/>
		</>
	);
}
