import {TSequence} from "@/components/campaigns/campaign/sequences/sequence";
import {ProgressCircle} from "@/components/charts/curcular-indicator";

import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";

import React from "react";


export function SequenceStatusIcons(
	{
		sequence,
	}: {
		sequence: TSequence,
	}) {
	return (
		<div className={"flex items-center gap-2"}>
			<Tooltip>
				<TooltipTrigger asChild>
					<ProgressCircle
						value={70}
						strokeWidth={1}
						className={cn(
							"size-4 opacity-50",
						)}
						circleProps={{
							className: "stroke-muted-foreground/40 dark:stroke-primary-lighter/40",
						}}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<p>70% of leads are in this step</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<ProgressCircle
						value={10}
						strokeWidth={1}
						className={cn(
							"size-4 opacity-50", "text-positive"
						)}
						circleProps={{
							className: "stroke-muted-foreground/40 dark:stroke-primary-lighter/40",
						}}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<p>10% of leads converted in this step</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
