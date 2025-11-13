import {Tag} from "lucide-react";

import {cn} from "@/lib/utils";

import type {TListOutputResult} from "@/tanstack/query/leads/labels/list.ts";

type TLabel = TListOutputResult["data"][number];

export default function Label(
	{
		label, className, textClassName
	}: {
		label: TLabel,
		className?: string
		textClassName?: string
	}
) {
	return (
		<div className={cn(
			"flex items-center gap-2",
			className
		)}>
			<Tag className={cn("h-4 w-4", labelTextColor(label.type))}/>
			<span className={textClassName}>{label.name}</span>
		</div>
	);
}

export const labelTextColor = (type: TLabel["type"]) => {
	let className = "text-primary";
	switch (type) {
		case "positive":
			className = "text-positive";
			break;
		case "negative":
			className = "text-destructive";
			break;
		case "neutral":
			className = "text-muted-foreground";
			break;
		case "warning":
			className = "text-warning";
			break;
	}
	return className;
};
