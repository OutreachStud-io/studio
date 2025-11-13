import {ProgressCircle} from "@/components/charts/curcular-indicator";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Activity, CircleAlert, CircleCheck, ClockAlert, LoaderPinwheel, Minus, RefreshCw, Timer} from "lucide-react";
import React from "react";
import {cn, numberToOrdinal, randomNumber} from "@/lib/utils";
import {type TEnhancedCampaign, type TCampaign} from "@/enhancers/campaign.ts";


const SendingStatus = (p: {
	campaign: TEnhancedCampaign;
	size?: "sm" | "md" | "lg";
}) => {
	if (p.campaign.isActive) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Activity className={cn(
						"text-primary-lighter",
						p.size === "md" ? "size-5" : p.size === "lg" ? "size-6" : "size-4"
					)}/>
				</TooltipTrigger>
				<TooltipContent className={"z-99"}>
					<p>Campaign is not active</p>
				</TooltipContent>
			</Tooltip>
		);
	}

	if (p.campaign.isEnded) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<CircleCheck className={cn(
						"text-primary-lighter",
						p.size === "md" ? "size-5" : p.size === "lg" ? "size-6" : "size-4"
					)}/>
				</TooltipTrigger>
				<TooltipContent className={"z-99"}>
					<p>Campaign ended</p>
				</TooltipContent>
			</Tooltip>
		);
	}

	if (p.campaign.isStopped) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<CircleAlert className={cn(
						"text-destructive",
						p.size === "md" ? "size-5" : p.size === "lg" ? "size-6" : "size-4"
					)}/>
				</TooltipTrigger>
				<TooltipContent className={"z-99"}>
					<p>{p.campaign.campaign.stoppedReason || "Stopped due to unknown reasons"}</p>
				</TooltipContent>
			</Tooltip>
		);

	}

	// if (p.campaign.scheduleEntries?.length) {
	// 	// loop through schedule entries and see if we're outside schedule
	// 	const now = new Date();
	// 	const isOutsideSchedule = p.campaign.scheduleEntries.every((entry) => {
	// 		const start = new Date(now);
	// 		start.setHours(entry.startHour, entry.startMinute, 0, 0);
	// 		const end = new Date(now);
	// 		end.setHours(entry.endHour, entry.endMinute, 0, 0);
	//
	// 		// Check if today is one of the scheduled days
	// 		const today = now.getDay();
	// 		if (!entry.daysOfWeek.includes(today)) {
	// 			return true; // Outside schedule if today is not in the schedule
	// 		}
	//
	// 		// Check if current time is outside the scheduled time range
	// 		return now < start || now > end;
	// 	});
	//
	// 	if (isOutsideSchedule) {
	// 		return (
	// 			<Tooltip>
	// 				<TooltipTrigger asChild>
	// 					<ClockAlert className={cn(
	// 						"text-warning",
	// 						p.size === "md" ? "size-5" : p.size === "lg" ? "size-6" : "size-4"
	// 					)}/>
	// 				</TooltipTrigger>
	// 				<TooltipContent className={"z-99"}>
	// 					<p>Outside sending schedule</p>
	// 				</TooltipContent>
	// 			</Tooltip>
	// 		);
	// 	}
	// }

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div>
					<LoaderPinwheel className={cn(
						"text-primary animate-spin",
						p.size === "md" ? "size-5" : p.size === "lg" ? "size-6" : "size-4"
					)}/>
				</div>
			</TooltipTrigger>
			<TooltipContent className={"z-99"}>
				<p>Sending</p>
			</TooltipContent>
		</Tooltip>
	);
};
export type TSequence = {
	percentage: number;
}

const SequenceStatus = ({sequences, size}: { sequences: TSequence[], size?: "sm" | "md" | "lg"; }) => {
	return (
		sequences.length > 0 && (
			<div className={"flex"}>
				{sequences.map((seq, index) => (
					<div key={index} className={"flex"}>
						<Tooltip>
							<TooltipTrigger asChild>
								<ProgressCircle
									value={seq.percentage}
									strokeWidth={1}
									className={cn(
										"text-primary",
										size === "md" ? "size-5" : size === "lg" ? "size-6" : "size-4"
									)}
									circleProps={{
										className: "stroke-sidebar-border dark:stroke-primary-lighter/40",
									}}
								/>
							</TooltipTrigger>
							<TooltipContent className={"z-99"}>
								<p>{seq.percentage}% of leads reached {numberToOrdinal(index + 1)} sequence</p>
							</TooltipContent>
						</Tooltip>

						{index < sequences.length - 1 && (
							<Minus className="size-4 text-muted-foreground -mx-1"/>
						)}
					</div>
				))}
			</div>
		)
	);
};

const EndDateStatus = (
	{
		campaign, size

	}: {
		campaign: TEnhancedCampaign,
		size?: "sm" | "md" | "lg";
	}
) => {
	if (campaign.campaign.endsAt) {
		if (campaign.isEnded) {
			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<CircleCheck className={cn(
							"text-muted-foreground",
							size === "md" ? "size-5" : size === "lg" ? "size-6" : "size-4"
						)}/>
					</TooltipTrigger>
					<TooltipContent className={"z-99"}>
						<p>Campaign ended</p>
					</TooltipContent>
				</Tooltip>
			);
		}

		const days = Math.floor(campaign.remainingRunTime / (1000 * 60 * 60 * 24));

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Timer className={cn(
						"text-muted-foreground",
						size === "md" ? "size-5" : size === "lg" ? "size-6" : "size-4"
					)}/>
				</TooltipTrigger>
				<TooltipContent className={"z-99"}>
					<p>Campaign ends in {days} days</p>
				</TooltipContent>
			</Tooltip>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<RefreshCw className={cn(
					"text-muted-foreground",
					size === "md" ? "size-5" : size === "lg" ? "size-6" : "size-4"
				)}/>
			</TooltipTrigger>
			<TooltipContent className={"z-99"}>
				<p>Campaign is running forever</p>
			</TooltipContent>
		</Tooltip>
	);
};

export type TSecondaryBarProps = {
	className?: string;
	size?: "sm" | "md" | "lg";
	campaign: TEnhancedCampaign;
}

export function StatusIcons(p: TSecondaryBarProps) {
	const {className} = p;

	return (
		<div className={cn(
			"flex gap-4",
			className,
		)}>
			<SendingStatus
				campaign={p.campaign}
				size={p.size}
			/>

			<EndDateStatus
				campaign={p.campaign}
				size={p.size}
			/>

			<SequenceStatus
				size={p.size}
				sequences={Array.from({
					length: randomNumber(0, 5)
				}, () => ({
					percentage: randomNumber(10, 100)
				}))}
			/>
		</div>
	);
}
