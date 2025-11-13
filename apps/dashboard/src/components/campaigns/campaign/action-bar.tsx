import {CampaignNotifications} from "@/components/campaigns/campaign/notifications";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useCampaignNotificationsQuery} from "@/tanstack/query/campaigns/notifications/list.ts";

import * as React from "react";
import {Bell, EyeClosed, EyeIcon} from "lucide-react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";


export type TCampaignActionBarProps = {
	campaignId: string;
	className?: string;
}

export function CampaignActionBar(p: TCampaignActionBarProps) {
	const notificationsQuery = useCampaignNotificationsQuery({
		input: {
			campaignId: p.campaignId,
		},
	});
	const [open, setOpen] = React.useState(false);
	const [showDismissed, setShowDismissed] = React.useState(false);

	const notifications = notificationsQuery.data;

	return <div className="flex items-center">
		<Drawer open={open} onOpenChange={setOpen} direction={"right"}>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon" className="size-8 relative cursor-pointer">
					<Bell/>
					<Badge variant="destructive" className={"absolute top-2 right-0 w-1 h-1 p-0"}>&nbsp;</Badge>
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left border-b">
					<DrawerTitle>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Bell className="size-4"/>
								Notifications
							</div>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size={"icon"}
										className="cursor-pointer"
										onClick={() => setShowDismissed(!showDismissed)}
									>
										{showDismissed && (
											<EyeIcon className="size-4"/>
										)}
										{!showDismissed && (
											<EyeClosed className="size-4"/>
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Show dismissed notifications</p>
								</TooltipContent>
							</Tooltip>
						</div>
						<DrawerDescription className="text-sm text-muted-foreground">
							You have {notifications ? notifications.data.length : 0} new notifications.
						</DrawerDescription>
					</DrawerTitle>
				</DrawerHeader>

				<div className="py-4 px-2 overflow-auto h-full">
					<CampaignNotifications
						campaignId={p.campaignId}
						showDismissed={showDismissed}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	</div>;
}
