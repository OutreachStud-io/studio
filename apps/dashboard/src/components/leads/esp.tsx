import React from "react";
import {MailIcon} from "lucide-react";
import {capitalize} from "remeda";

import {cn} from "@/lib/utils";

import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import type {TListOutputResultItem} from "@/tanstack/query/campaigns/leads/list.ts";

type TEsp = NonNullable<TListOutputResultItem["lead"]>["esp"];

export const getLeadESPFile = (esp: TEsp): string => {
	switch (esp) {
		case "outlook":
		case "microsoft":
			return "microsoft.svg";
		case "gmail":
		case "gsuite":
			return "google-workspace.svg";
		case "zoho":
		case "zohopro":
			return "zoho.svg";
		case "yahoo":
			return "yahoo.svg";
		default:
			return "other.svg"; // Default icon for other ESPs
	}
};

export function LeadESPIcon({esp, className}: { esp: TEsp, className?: string }) {
	if (esp === "other" || !esp) {
		return (
			<MailIcon
				width={20}
				height={20}
				className={cn(
					"h-5 w-5 stroke-muted-foreground",
					className
				)}/>
		);
	}
	return (
		<img src={"/esp/" + getLeadESPFile(esp)}
			 alt={esp}
			 width={20}
			 height={20}
			 className={cn(
				 "h-5 w-5",
				 className
			 )}/>
	);
}

export default function LeadESP({esp, className}: { esp: TEsp, className?: string }) {
	return (
		<Tooltip>
			<TooltipTrigger>
				<LeadESPIcon esp={esp} className={className}/>
			</TooltipTrigger>
			<TooltipContent>
				<p>{capitalize(esp)}</p>
			</TooltipContent>
		</Tooltip>
	);
}
