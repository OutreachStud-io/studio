import React from "react";

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
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

import {useSuspenseCampaignLeadsListsQuery} from "@/tanstack/query/campaigns/leads_lists/list.ts";

export function CampaignLeadsListPicker(
	{campaignId}: { campaignId: string }
) {
	const id = React.useId();
	const leadsListsQuery = useSuspenseCampaignLeadsListsQuery({
		input: {
			campaignId
		}
	});

	console.log(leadsListsQuery.data);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					aria-label="Reset filters"
					size="sm"
					className="border-dashed"
					variant={"ghost"}
				>
					<Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
						8
					</Badge>
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
				<div className="grid flex-1 auto-rows-min gap-6 px-4">
					<div className="flex items-start gap-2">
						<Switch id={id} defaultChecked/>
						<div className="flex flex-col gap-1">
							<Label htmlFor={id}>Marketing emails</Label>
							<p className="text-xs text-muted-foreground">
								22,000 leads in this list
							</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<Switch id={id} defaultChecked/>
						<div className="flex flex-col gap-1">
							<Label htmlFor={id}>Marketing emails</Label>
							<p className="text-xs text-muted-foreground">
								22,000 leads in this list
							</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<Switch id={id} defaultChecked/>
						<div className="flex flex-col gap-1">
							<Label htmlFor={id}>Marketing emails</Label>
							<p className="text-xs text-muted-foreground">
								22,000 leads in this list
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2">
						<Switch id={id} defaultChecked/>
						<div className="flex flex-col gap-1">
							<Label htmlFor={id}>Marketing emails</Label>
							<p className="text-xs text-muted-foreground">
								22,000 leads in this list
							</p>
						</div>
					</div>
				</div>
				<SheetFooter>
					<Button type="submit">Save changes</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
