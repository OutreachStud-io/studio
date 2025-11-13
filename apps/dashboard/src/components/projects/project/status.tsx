import React from "react";

import {
	Badge
} from "@/components/ui/badge-custom.tsx";
import {ProjectEnhancer} from "@/enhancers/projects.ts";
import {cn} from "@/lib/utils.ts";

import type {TGetOutputResult} from "@/tanstack/query/projects/get.ts";


export function ProjectStatus(
	{project, className, ...rest}: {
		project: TGetOutputResult;
	} & React.ComponentProps<typeof Badge>) {

	const pe = new ProjectEnhancer(project);

	let statusTxt = "Active";
	let statusVariant: "default" | "positive" | "warning" | "secondary" | "destructive" | "outline" = "positive";

	if (pe.isArchived) {
		statusTxt = "Archived";
		statusVariant = "secondary";
	}

	if (pe.isPaused) {
		statusTxt = "Paused";
		statusVariant = "warning";
	}

	return (
		<Badge
			variant={statusVariant}
			className={cn(
				"rounded-[3px] text-xs border-0",
				className
			)}
			{...rest}
		>{statusTxt}</Badge>
	);
}
