"use client";

import {useIsMobile} from "@/hooks/use-mobile";
import React from 'react';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export type TAppBarTimeSelectorActionProps = {
	/**
	 * The time range selected by the user.
	 * @default "90d"
	 */
	timeRange?: "90d" | "30d" | "7d";
	/**
	 * Callback function to handle time range changes.
	 */
	onTimeRangeChangeAction?: (timeRange: "90d" | "30d" | "7d") => void;
}

export function AppBarTimeSelectorAction() {
	const isMobile = useIsMobile();
	const [timeRange, setTimeRange] = React.useState("90d");
	React.useEffect(() => {
		if (isMobile) {
			setTimeRange("7d");
		}
	}, [isMobile]);

	return (
		<>
			<Select value={timeRange} onValueChange={setTimeRange}>
				<SelectTrigger
					className="text-xs !h-7 !px-2 !py-0 flex w-auto **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate cursor-pointer"
					size="sm"
					aria-label="Select a value"
				>
					<SelectValue placeholder="Last 3 months"/>
				</SelectTrigger>
				<SelectContent className="rounded-xl">
					<SelectItem value="90d" className="rounded-lg cursor-pointer">
						Last 3 months
					</SelectItem>
					<SelectItem value="30d" className="rounded-lg cursor-pointer">
						Last 30 days
					</SelectItem>
					<SelectItem value="7d" className="rounded-lg cursor-pointer">
						Last 7 days
					</SelectItem>
				</SelectContent>
			</Select>
		</>
	);
}
