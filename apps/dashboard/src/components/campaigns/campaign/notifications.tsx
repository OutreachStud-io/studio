import * as React from "react";
import TimeAgo from "react-timeago";
import {ScrollArea} from "@/components/ui/scroll-area";

import {EmptyNotifications} from "@/components/campaigns/notifications/empty.tsx";
import {useCampaignNotificationsQuery} from "@/tanstack/query/campaigns/notifications/list.ts";


import {Button} from "@/components/ui/button";

import {cn} from "@/lib/utils";

export interface CampaignNotificationsProps {
	className?: string;
	showDismissed?: boolean;
	campaignId: string;
}

export function CampaignNotifications(
	{
		campaignId, className, showDismissed = false, ...rest
	}: CampaignNotificationsProps & React.HTMLAttributes<HTMLDivElement>
) {
	const notificationsQuery = useCampaignNotificationsQuery({
		input: {
			campaignId: campaignId,
		},
	});

	if (notificationsQuery.isLoading) {
		return <div>Loading...</div>;
	}

	const data = notificationsQuery.data?.data;

	if (!data || data.length === 0) {
		return <EmptyNotifications className={"h-full"}/>;
	}

	return (
		<div className={cn(
			"h-full flex flex-col gap-2", className,
		)} {...rest}>
			<ScrollArea className={"flex-1"}>
				<ul>
					{data.length > 0 && data.filter(
						// filter out the dismissed ones unless showDismissed is true
						(notification) => showDismissed ? true : !notification.isDismissed
					).sort(
						// sort by date descending
						(a, b) =>
							new Date(b.notification.createdAt).getTime() - new Date(a.notification.createdAt).getTime()
					).map((notification, i) => (
						<li
							key={notification.notification.id}
							className={cn(
								"p-2 rounded-md bg-card mb-4"
							)}
						>
							<div className="flex items-center justify-between bg-background p-2 rounded-md">
								<p className="text-sm text-muted-foreground">{notification.notification.message}</p>
							</div>

							<div className={cn(
								"pt-2 px-1 text-sm",
							)}>
								<div className={cn(
									"flex gap-1 items-center",
									notification.isWarning && "text-warning",
									notification.isError && "text-destructive",
								)}>
									{notification.notification.title}
								</div>

								<div className="flex justify-between text-xs items-center text-muted-foreground">
									<TimeAgo date={notification.notification.createdAt}/>

									{!notification.isDismissed && (
										<Button
											variant="link"
											size={"sm"}
											className={cn(
												"h-auto p-0 py-1 text-xs height-auto cursor-pointer",
												"hover:underline text-muted-foreground"
											)}
											onClick={() => {
												// mutate
											}}
										>
											Dismiss
										</Button>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			</ScrollArea>

			<Button variant="outline" className={"block w-full"}>
				Clear all
			</Button>
		</div>
	);
}
