import React from "react";

import {IconFolderCode} from "@tabler/icons-react";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";


export function EmptyNotifications(props: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Empty {...props}>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconFolderCode/>
				</EmptyMedia>
				<EmptyTitle>No notifications</EmptyTitle>
				<EmptyDescription>
					There are no notifications for this campaign yet.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
