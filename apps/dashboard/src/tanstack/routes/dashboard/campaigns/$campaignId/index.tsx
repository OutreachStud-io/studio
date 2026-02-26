import React from "react";

import {Cog} from "lucide-react";
import {Link, createFileRoute} from '@tanstack/react-router';

import {ScrollArea} from "@/components/ui/scroll-area";

import {urls} from "@/lib/urls";
import {useCampaignQuery} from "@/tanstack/query/campaigns/get.ts";
import {Campaign as CampaignEnhancer} from "@/enhancers/campaign.ts";
import {useCampaignsStatsQuery} from "@/tanstack/query/campaigns/stats.ts";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {CampaignActionBar} from "@/components/campaigns/campaign/action-bar";
import {StatusIcons} from "@/components/campaigns/campaign/status-icons";
import {TabbedBarChart} from "@/components/charts/tabbed-bar.tsx";
import TimeOfDayChart from "@/components/charts/campaigns-timeline";
import {HalfRadialChart} from "@/components/charts/half-radial";
import {SentimentChartWidget} from "@/components/charts/sentiment-chart-widget";
import {SecondaryBar} from "@/components/general/secondary-bar";
import SidebarLayout from "@/components/sidebar/layout";
import WorldMap from "@/components/world-map/map";
import WorlMapTable from "@/components/world-map/table";
import {AppBar} from "@/components/appbar/bar";

export const Route = createFileRoute('/dashboard/campaigns/$campaignId/')({
	component: Page,
});

function Page() {
	const {campaignId} = Route.useParams();

	const campaignQuery = useCampaignQuery({
		input: {
			id: campaignId,
		},
	});

	const statsQuery = useCampaignsStatsQuery({
		input: {
			projectId : "cdc39c27-8e82-4107-a4c3-54c6b66fd327",
			campaignId: campaignId,
			// filter    : {
			// 	period: {
			// 		preset: "last_90_days"
			// 	}
			// }
		},
	});

	if (campaignQuery.isLoading || !campaignQuery.data) {
		return <div>Loading...</div>;
	}

	const ce = new CampaignEnhancer(campaignQuery.data);

	return (
		<SidebarLayout open={false}>
			<AppBar
				action={<Link
					to={urls.campaigns.settings(campaignId)}
					className={"flex items-center gap-2"}>
					<Button size={"sm"} variant={"secondary"} className={"cursor-pointer"}>
						<Cog/> Settings
					</Button>
				</Link>}
			/>

			<SecondaryBar
				title={<StatusIcons
					campaign={ce}
					size={"md"}
				/>}

				action={<CampaignActionBar campaignId={campaignId}/>}
			/>

			<ScrollArea>
				<TabbedBarChart
					title={"Active Campaign Stats"}
					description={"Accumulated stats from all your campaigns for the last 90 days."}
					chartData={[{
						label  : "Emails sent",
						entries: statsQuery.data?.map((s) => {
							return {date: s.date, count: s.sent};
						}) || [],
					}, {
						label  : "Opens",
						entries: statsQuery.data?.map((s) => {
							return {date: s.date, count: s.opened};
						}) || [],
					}, {
						label  : "Replies",
						entries: statsQuery.data?.map((s) => {
							return {date: s.date, count: s.clicked};
						}) || [],
					}]}
					className={"border-0 border-b p-0 m-0 shadow-none! rounded-none! bg-transparent"}
					contentClassName={"px-6"}
				/>

				<div
					className=" dark:*:data-[slot=card]:bg-card grid grid-cols-0 md:grid-cols-2 2xl:grid-cols-4 gap-6 px-6 py-10">
					<HalfRadialChart
						label={"Health"}
						percent={97.5}
						color={"var(--chart-2)"}
						title={"Email Accounts Health"}
						subtitle={"All accounts in good health"}
					/>
					<HalfRadialChart
						label={"Hard Bounce Rate"}
						percent={1}
						color={"var(--destructive)"}
						title={"Bounce Rate"}
						subtitle={"Bounce rate within healthy numbers"}
					/>
					<SentimentChartWidget
						positive={77.8}
						negative={22.2}
						title={"Reply rate"}
						subtitle={"Percentage of users that replied"}
					/>
					<HalfRadialChart
						label={"Replies"}
						percent={2.2}
						color={"var(--chart-2)"}
						title={"Reply rate"}
						subtitle={"Reply rate within healthy numbers"}
					/>
				</div>


				<Card className="bg-transparent border-0 shadow-none p-0">
					<CardHeader className={"border-t pt-6 text-center"}>
						<CardTitle className={""}>
							Replies by day, hour and location
						</CardTitle>
						<CardDescription>
							Get a better understanding of when and where your users are replying to your
							campaigns.
						</CardDescription>
					</CardHeader>

					<CardContent className={"grid grid-cols-4 gap-6 items-center p-0 mx-6 "}>
						<TimeOfDayChart
							className={"col-span-4 md:col-span-2 xl:col-span-1"}
						/>

						<WorldMap
							className={"col-span-2 hidden xl:block h-full"}
						/>

						<WorlMapTable
							locations={[]}
							className={"col-span-4 md:col-span-2 xl:col-span-1 w-full h-full"}
						/>
					</CardContent>
				</Card>
			</ScrollArea>
		</SidebarLayout>
	);
}
