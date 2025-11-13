import React from "react";
import {
	CheckCircle,
	CircleOff,
	HelpCircle,
	ListChecks,
	MailX,
	CalendarSync,
	MailCheck,
} from "lucide-react";

import {cn} from "@/lib/utils";

import type {TListOutputResultItem} from "@/tanstack/query/campaigns/leads/list.ts";

type TStatusMeta = {
	value: TListOutputResultItem["status"];
	label: string;
	className?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export const statuses: TStatusMeta[] = [
	{value: "contacted", label: "Contacted", icon: MailCheck, className: "text-muted-foreground"},
	{value: "completed", label: "Completed", icon: ListChecks, className: "text-positive"},
	{value: "replied", label: "Replied", icon: CheckCircle, className: "text-positive"},
	{value: "rescheduled", label: "Rescheduled", icon: CalendarSync, className: "text-muted-foreground"},
	{value: "unsubscribed", label: "Unsubscribed", icon: CircleOff, className: "text-destructive"},
	{value: "bounced", label: "Bounced", icon: MailX, className: "text-destructive"},
	{value: "skipped", label: "Skipped", icon: HelpCircle, className: "text-destructive"},
];

export default function LeadStatus(
	{
		status, className, ...props
	}: {
		status: TListOutputResultItem["status"],
	} & React.HTMLAttributes<HTMLDivElement>
) {
	const statusDisplay = statuses.find(s => s.value === status);
	if (!statusDisplay) {
		return (
			<div className={cn(
				"flex items-center gap-2",
				className
			)} {...props}>
				<span className="text-muted-foreground">Unknown Status</span>
			</div>
		);
	}

	const StatusIcon = statusDisplay.icon;

	return (
		<div className={cn(
			"flex items-center gap-2",
			className
		)} {...props}>
			{StatusIcon && (
				<StatusIcon className={cn("h-4 w-4 ", statusDisplay.className)}/>
			)}
			{statusDisplay.label}
		</div>
	);
}
