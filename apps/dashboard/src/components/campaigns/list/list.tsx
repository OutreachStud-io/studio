import React from "react";

import {StatusBadge} from "@/components/campaigns/campaign/status-badge";
import {StatusIcons} from "@/components/campaigns/campaign/status-icons";
import {DiagonalPattern} from "@/components/general/pattern";
import {urls} from "@/lib/urls";

import type {TContract} from "@outreachstudio/orpc/contract";

import {cn, percentFromValue} from "@/lib/utils";
import {Link} from "@tanstack/react-router";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Campaign as CampaignEnhancer} from "@/enhancers/campaign.ts";

export type TCampaignsListProps = {
	className?: string;
	campaigns: TContract["Campaigns"]["ListOutput"];
}

const Stat = (
	{
		label, value, className,
	}: {
		label: string;
		value: number | string;
		className?: string;
	}) => {
	return (
		<div
			className={cn(
				"relative flex flex-1 flex-col justify-center gap-1 border-t px-6",
				"py-4 text-left border-l first-of-type:border-l-0 xl:border-t-0 xl:border-l! relative",
				className
			)}
		>
			<span className="text-muted-foreground text-xs">
				{label}
			</span>
			<span className="text-lg leading-none font-light sm:text-3xl">
				{Number(value).toLocaleString()}
			</span>
		</div>
	);
};


const repliesBgClassname = (replies: number, opens: number) => {
	if (replies === 0) {
		return "";
	}
	const ratio = replies / opens;
	if (ratio < 0.1) {
		return "bg-destructive/5";
	} else if (ratio < 0.3) {
		return "bg-warning/8";
	} else if (ratio < 0.5) {
		return "bg-positive/9";
	}
	return "bg-positive/12";
};

const opensBgClassname = (sent: number, opens: number) => {
	if (opens === 0) {
		return "";
	}
	const ratio = opens / sent;
	if (ratio < 0.1) {
		return "bg-destructive/5";
	} else if (ratio < 0.3) {
		return "bg-warning/8";
	} else if (ratio < 0.5) {
		return "bg-positive/9";
	}
	return "bg-positive/12";
};


const CampaignsList = (p: TCampaignsListProps) => {
	if (!p.campaigns || p.campaigns.data.length === 0) {
		return (
			<div className={cn(
				"flex flex-1 flex-col items-center justify-center p-6 text-center",
				p.className
			)}>
				<h3 className={"text-lg font-semibold mb-2"}>No campaigns yet</h3>
				<p className={"text-sm text-muted-foreground max-w-md"}>
					You haven't created any campaigns yet. Create your first campaign to start engaging with your
					audience and
					driving results.
				</p>
				<Link
					to={urls.campaigns.create}
					className={"mt-4 inline-block text-sm font-medium text-primary hover:underline"}
				>
					Create Campaign
				</Link>
			</div>
		);
	}

	return (
		<div className={cn(
			"",
			p.className
		)}>
			{p.campaigns!.data.sort((a, b) => {
				const cEnhancedA = new CampaignEnhancer(a);
				const cEnhancedB = new CampaignEnhancer(b);

				const statusA = cEnhancedA.isActive ? 1 : -1;
				const statusB = cEnhancedB.isActive ? 1 : -1;

				if (statusA !== statusB) {
					return statusA - statusB;
				}

				const dateA = cEnhancedA.lastUpdated.getTime();
				const dateB = cEnhancedB.lastUpdated.getTime();

				return dateA - dateB;
			}).map((campaign) => {
				const ce = new CampaignEnhancer(campaign);

				return (
					<Link to={urls.campaigns.show(campaign.id)} key={campaign.id} className={"group/link"}>
						<Card
							className={"border-0 border-b p-0 m-0 shadow-none! rounded-none! bg-transparent relative"}
						>
							{ce.isEnded && (
								<DiagonalPattern/>
							)}

							<CardHeader className="gap-0 grid xl:grid-cols-2 2xl:grid-cols-5 items-stretch !p-0">
								<div className="flex flex-1 flex-col justify-center px-6 py-5 xl:py-4 2xl:col-span-3 ">
									<CardTitle className={"flex z-99"}>
										<div className={"flex gap-2 items-center mb-1"}>
											<StatusBadge campaign={ce}/>
											{campaign.name}
										</div>
									</CardTitle>
									<CardDescription className={"z-99"}>
										<div className={"truncate text-ellipsis"}>
											{campaign.description}
										</div>

										<div className={"mt-1 flex gap-4"}>
											<StatusIcons campaign={ce}/>
										</div>
									</CardDescription>
								</div>

								<div className="hidden xl:grid grid-cols-4 2xl:col-span-2">
									<Stat
										label={"Leads"}
										value={campaign.counters.leads || 0}
									/>
									<Stat
										label={"Sent"}
										value={campaign.counters.sent || 0}
									/>
									<Stat
										label={"Opens " + (campaign.counters.opened ? `(${percentFromValue(
											campaign.counters.opened,
											campaign.counters.sent || 0).toPrecision(1)}%)` : "")}
										value={campaign.counters.opened || 0}
										className={opensBgClassname(
											campaign.counters.sent || 0,
											campaign.counters.opened || 0
										)}
									/>
									<Stat
										label={`Replies ${ce.replyRate.toPrecision(1)}%`}
										value={campaign.counters.replied || 0}
										className={repliesBgClassname(
											campaign.counters.replied || 0,
											campaign.counters.opened || 0
										)}
									/>
								</div>
							</CardHeader>
						</Card>
					</Link>
				);
			})}
		</div>
	);
};

export default CampaignsList;
