"use client";

import {Skeleton} from "@/components/ui/skeleton";
import * as React from "react";
import {useEffect, useState} from "react";

import {cn} from "@/lib/utils";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({length: 24}, (_, i) => (i < 10 ? `0${i}` : i.toString()));
const hoursAmPm = Array.from({length: 24}, (_, i) => {
	return i < 12 ? `${i < 10 ? `0${i}` : i}:00 AM` : `${i - 12 < 10 ? `0${i - 12}` : i - 12}:00 PM`;
});

const getIntensityClass = (count: number) => {
	if (count <= 10) return 'bg-card dark:bg-transparent';
	if (count <= 20) return 'bg-accent-2/10';
	if (count <= 30) return 'bg-accent-2/20';
	if (count <= 40) return 'bg-accent-2/30';
	if (count <= 50) return 'bg-accent-2/40';
	if (count <= 60) return 'bg-accent-2/50';
	if (count <= 70) return 'bg-accent-2/60';
	if (count <= 80) return 'bg-accent-2/70';
	if (count <= 90) return 'bg-accent-2/80';
	if (count <= 100) return 'bg-accent-2/90';
	return 'bg-accent-2/100';
};

export type TTimeOfDayChartProps = {
	className?: string;
};

const TimeOfDayChart = (p: TTimeOfDayChartProps) => {
	const [randomData, setRandomData] = useState<number[][]>([]);

	useEffect(() => {
		// Generate random data once on mount
		const data = days.map(() =>
			hours.map(() => Math.floor(Math.random() * 100) + 1)
		);
		setRandomData(data);
	}, []);

	// Show loading state while data is being generated
	if (randomData.length === 0) {
		return <div className={"h-full"}>
			<Skeleton className="h-full w-full rounded-lg"/>
		</div>;
	}

	return (
		<div className={cn(
			p.className
		)}>
			{hours.map((hour, hourIndex) => (
				<div key={hour} className="flex items-center mb-[2px]">
					<span className="w-7 text-left pr-2 text-xs text-muted-foreground">{hour}</span>
					<div className="flex-1 grid grid-cols-7 gap-[2px]">
						{days.map((day, dayIndex) => {
							const randomCount = randomData[dayIndex][hourIndex];

							return (
								<Tooltip key={day}>
									<TooltipTrigger asChild>
										<div
											suppressHydrationWarning={true}
											className={cn(
												`cursor-pointer h-4 2xl:h-5 w-auto flex items-center justify-center rounded-xs`,
												// there is a performance issue with using a hover on this
												// many elements so no hover atm until we investigate
												getIntensityClass(randomCount),
											)}
										/>
									</TooltipTrigger>
									<TooltipContent>
										<p>Replies: {randomCount}</p>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</div>
			))}

			<div className="flex items-center mb-1">
				<span className="p-0 w-7 text-right pr-2 text-xs">&nbsp;</span>
				<div className="flex-1 grid grid-cols-7 gap-1">
					{days.map((day, dayIndex) => {
						return (
							<div
								key={day}
								className={cn(
									`even:opacity-0 text-muted-foreground 2xl:even:opacity-100 h-6 w-auto flex items-center justify-center text-xs font-mono`,
								)}
							>
								{day}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default TimeOfDayChart;
