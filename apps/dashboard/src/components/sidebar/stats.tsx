"use client";

import {percentFromValue} from "@/lib/utils";

import * as React from "react";

import {Progress} from "@/components/ui/progress";


import {
	Card,
	CardContent,
} from "@/components/ui/card";

export interface TStatsProps {
	className?: string;
	sentToday?: number;
	toSendToday?: number;
	sendCapacity?: number;
	activeCampaigns?: number;
	totalCampaigns?: number;
	earnings?: number;
}

export function Stats(p: TStatsProps) {
	return (
		<Card className="bg-transparent flex flex-col gap-4 shadow-none cursor pointer px-1 py-0 m-0 border-0 mb-4">
			<CardContent className="flex-1 p-0 opacity-70">
				<ul>
					<li>
						<div className={"flex justify-between mb-1 font-mono text-xs text-muted-foreground"}>
							<div>Send capacity</div>
							<div>
								{Number(p.sendCapacity ?? 0).toLocaleString()}/d
							</div>
						</div>
						<Progress value={100} className={"h-[6px]"}/>
					</li>
					<li className={"mt-3"}>
						<div className={"flex justify-between mb-1 font-mono text-xs text-muted-foreground"}>
							<div>Sent today</div>
							<div>
								{Number(p.sentToday ?? 0).toLocaleString()}
								/{Number(p.toSendToday ?? 0).toLocaleString()}
							</div>
						</div>
						<Progress value={percentFromValue(
							Number(p.sentToday ?? 0),
							Number(p.toSendToday ?? 0)
						)} className={"h-[6px]"}/>
					</li>
					<li className={"mt-3"}>
						<div className={"flex justify-between mb-1 font-mono text-xs text-muted-foreground"}>
							<div>Active campaigns</div>
							<div>
								{Number(p.activeCampaigns ?? 0).toLocaleString()}
								/{Number(p.totalCampaigns ?? 0).toLocaleString()}
							</div>
						</div>
						<Progress value={percentFromValue(
							Number(p.activeCampaigns ?? 0),
							Number(p.totalCampaigns ?? 0)
						)} className={"h-[6px]"}/>
					</li>
					<li className={"mt-3"}>
						<div className={"flex justify-between mb-1 font-mono text-xs text-muted-foreground"}>
							<div>Earnings</div>
							<div>
								${Number(p.earnings ?? 0).toLocaleString()}
							</div>
						</div>
						<Progress value={100} className={"h-[6px]"}/>
					</li>
				</ul>
			</CardContent>
		</Card>
	);
}
