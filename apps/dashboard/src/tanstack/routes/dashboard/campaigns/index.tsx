import React from "react";
import {z} from "zod";

import {CirclePlus} from "lucide-react";
import {crumbs} from "@/hooks/use-crumbs.ts";
import {useSuspenseQuery} from "@tanstack/react-query";
import {Link, createFileRoute} from '@tanstack/react-router';

import {urls} from "@/lib/urls";

import {Button} from "@/components/ui/button";
import {AppBar} from "@/components/appbar/bar";
import {TabbedBarChart} from "@/components/charts/tabbed-bar.tsx";
import SidebarLayout from "@/components/sidebar/layout";
import CampaignsList from "@/components/campaigns/list/list";
import {getCampaignsQueryOptions} from "@/tanstack/query/campaigns/list.ts";
import {getCampaignsStatsQueryOptions} from "@/tanstack/query/campaigns/stats.ts";

const minimumLimit = 10;
const defaultLimit = 20;
const maximumLimit = 50;

const campaignsSearchSchema = z.object({
	pagination: z.object({
		limit : z
			.number()
			.int()
			.min(minimumLimit)
			.max(maximumLimit)
			.default(defaultLimit)
			.catch(defaultLimit)
			.optional(),
		offset: z
			.number()
			.int()
			.min(0)
			.default(0)
			.catch(0)
			.optional(),
	}).optional(),
	projectId : z.uuid()
});

const campaignsQueryOptions = (
	projectId: string
) => getCampaignsQueryOptions({
	projectId: projectId
});

const campaignsStatsQueryOptions = (
	projectId: string
) => getCampaignsStatsQueryOptions({
	projectId: projectId,
});

export const Route = createFileRoute('/dashboard/campaigns/')({
	component     : Page,
	validateSearch: campaignsSearchSchema,
	loaderDeps    : ({search}) => (search),
	loader        : async ({params, context, deps}) => {
		// seed the cache
		await context.queryClient.ensureQueryData(
			campaignsQueryOptions(deps.projectId)
		);
		await context.queryClient.ensureQueryData(
			campaignsStatsQueryOptions(deps.projectId)
		);

		return {
			crumbs: crumbs(
				{title: 'Dashboard', link: {to: '/dashboard'}},
				{title: 'Campaigns', link: {to: '/dashboard/campaigns'}},
			),
		};
	}
});

function Page() {
	const search = Route.useSearch();

	const {data: campaigns} = useSuspenseQuery(
		campaignsQueryOptions(search.projectId)
	);

	const {data: campaignsStats} = useSuspenseQuery(
		campaignsStatsQueryOptions(search.projectId)
	);

	return (
		<SidebarLayout>
			<AppBar
				action={<Button size={"sm"} variant={"secondary"} asChild={true}>
					<Link to={urls.campaigns.create} className={"flex items-center gap-2 text-xs"}>
						<CirclePlus/> Create Campaign
					</Link>
				</Button>}
			/>

			<TabbedBarChart
				title={"Active Campaign Stats"}
				description={"Accumulated stats from all your campaigns for the last 90 days."}
				chartData={[{
					label  : "Emails sent",
					entries: campaignsStats.map((s) => {
						return {date: s.date, count: s.sent};
					}) || [],
				}, {
					label  : "Opens",
					entries: campaignsStats.map((s) => {
						return {date: s.date, count: s.opened};
					}) || [],
				}, {
					label  : "Replies",
					entries: campaignsStats.map((s) => {
						return {date: s.date, count: s.clicked};
					}) || [],
				}]}
				className={"border-0 border-b p-0 m-0 shadow-none! rounded-none! bg-transparent"}
				contentClassName={"px-6"}
			/>

			<div className="flex flex-1 flex-col">
				<CampaignsList campaigns={campaigns}/>
			</div>
		</SidebarLayout>
	);
}
