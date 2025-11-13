import * as React from "react";

export type TSequenceMeta = {
	value: string;
	label: string;
	className?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export const sequences: TSequenceMeta[] = [
	{
		label: "First",
		value: "first",
	},
	{
		label: "Second",
		value: "second",
	},
	{
		label: "Third",
		value: "third",
	},
];
