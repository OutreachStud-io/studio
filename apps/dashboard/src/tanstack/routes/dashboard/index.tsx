import {createFileRoute} from "@tanstack/react-router";

import {AppBarTimeSelectorAction} from "@/components/appbar/time-selector-action";
import TimeOfDayChart from "@/components/charts/campaigns-timeline";
import {HalfRadialChart} from "@/components/charts/half-radial";
import WorldMap from "@/components/world-map/map";
import WorlMapTable from "@/components/world-map/table";
import {
	Card,
	CardContent, CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {TabbedBarChart} from "@/components/charts/tabbed-bar.tsx";
import {AppBar} from "@/components/appbar/bar";
import SidebarLayout from "@/components/sidebar/layout";
import {SentimentChartWidget} from "@/components/charts/sentiment-chart-widget";
import {useCampaignsStatsQuery} from "@/tanstack/query/campaigns/stats.ts";

export const Route = createFileRoute('/dashboard/')({
	component: Page,
});

function Page() {
	const campaignsStatsQuery = useCampaignsStatsQuery({
		input: {
			projectId: "cdc39c27-8e82-4107-a4c3-54c6b66fd327",
			filter   : {
				period: {
					preset: "last_90_days"
				}
			}
		},
	});

	return (
		<SidebarLayout>
			<AppBar
				action={<AppBarTimeSelectorAction/>}
			/>

			<TabbedBarChart
				title={"Active Campaign Stats"}
				description={"Accumulated stats from all your campaigns for the last 90 days."}
				chartData={[{
					label  : "Emails sent",
					entries: campaignsStatsQuery.data?.map((s) => {
						return {date: s.date, count: s.sent};
					}) || [],
				}, {
					label  : "Opens",
					entries: campaignsStatsQuery.data?.map((s) => {
						return {date: s.date, count: s.opened};
					}) || [],
				}, {
					label  : "Replies",
					entries: campaignsStatsQuery.data?.map((s) => {
						return {date: s.date, count: s.clicked};
					}) || [],
				}]}
				className={"border-0 border-b p-0 m-0 shadow-none! rounded-none! bg-transparent"}
				contentClassName={"px-6"}
			/>

			<div
				className=" dark:*:data-[slot=card]:bg-card grid grid-cols-0 md:grid-cols-2 2xl:grid-cols-4 gap-6 px-6 py-6">
				<HalfRadialChart
					label={"Health"}
					percent={97.5}
					color={"var(--positive)"}
					title={"Email Accounts Health"}
					subtitle={"Total health of your sending email accounts"}
				/>
				<HalfRadialChart
					label={"Hard Bounce Rate"}
					percent={1}
					color={"var(--destructive)"}
					title={"Bounce Rate"}
					subtitle={"Hard bounce rates that were detected"}
				/>
				<SentimentChartWidget
					positive={78}
					negative={22}
					title={"Reply sentiment"}
					subtitle={"Reply sentiment based on AI analysis"}
				/>
				<HalfRadialChart
					label={"Converted"}
					percent={1.2}
					color={"var(--positive)"}
					title={"Conversion rate"}
					subtitle={"Percentage of users that converted"}
				/>
			</div>


			<Card className="bg-transparent border-0 shadow-none">
				<CardHeader className={"border-t pt-6 text-center"}>
					<CardTitle className={""}>
						Replies by day, hour and location
					</CardTitle>
					<CardDescription>
						Get a better understanding of when and where your users are replying to your campaigns.
					</CardDescription>
				</CardHeader>

				<CardContent className={"flex-col grid grid-cols-4 gap-6 items-center p-0 mx-6 "}>
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
		</SidebarLayout>
	);
}
