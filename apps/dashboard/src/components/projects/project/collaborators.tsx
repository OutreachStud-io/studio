import React from "react";

import {avatarFallback, cn} from "@/lib/utils.ts";
import {Link} from "@tanstack/react-router";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import type {TGetOutputResult} from "@/tanstack/query/projects/get.ts";


export function ProjectCollaborators(
	{project, className}: {
		project: TGetOutputResult;
	} & React.ComponentProps<"div">) {
	const totalCount = project.collaborators?.count || 0;

	const collaborators = project.collaborators?.list.slice(
		0, 5
	);

	const additionalCount = totalCount > (collaborators?.length || 0)
		? totalCount - (collaborators?.length || 0)
		: 0;

	if (!collaborators || collaborators.length === 0) {
		return <div className={"text-xs text-muted-foreground"}>
			No collaborators
		</div>;
	}

	return (
		<Link
			to={`/dashboard/projects`}
			className={cn(
				"*:data-[slot=avatar]:ring-primary-foreground",
				"inline-flex items-center -space-x-2 *:data-[slot=avatar]:ring-1",
				className
			)}
		>
			{collaborators?.map((collaborator) => (
				<Tooltip key={collaborator.id}>
					<TooltipTrigger>
						<Avatar className="size-6">
							<AvatarImage
								src={collaborator.avatar || "https://avatars.githubusercontent.com/u/95449269"}
								alt={`${collaborator.name}`}
							/>
							<AvatarFallback>{avatarFallback(collaborator.name)}</AvatarFallback>
						</Avatar>
					</TooltipTrigger>
					<TooltipContent>
						<p>{`${collaborator.name}`}</p>
					</TooltipContent>
				</Tooltip>
			))}


			{additionalCount > 0 && (
				<Avatar className="size-6">
					<AvatarFallback>
						<span className={"text-xs"}>
							+{additionalCount}
						</span>
					</AvatarFallback>
				</Avatar>
			)}
		</Link>
	);
}
