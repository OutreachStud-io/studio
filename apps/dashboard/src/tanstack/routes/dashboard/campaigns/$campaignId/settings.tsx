import {CampaignLeadsListPicker} from "@/components/campaigns/campaign/settings/leads/list-picker.tsx";

import React from "react";

import {
	createStandardSchemaV1,
	useQueryStates
} from 'nuqs';

import {createFileRoute} from '@tanstack/react-router';

import {
	Tabs,
	TabsList, TabsPanel, TabsTab,
} from "@/components/ui/tabs";

import {
	dataTableSearchOptions,
	DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE
} from "@/tanstack/routes/utils.ts";

import {useTableRouteSorters} from "@/hooks/use-route-sorters.ts";
import {useTableRouteFilters} from "@/hooks/use-route-filters.ts";

import {crumbs} from "@/hooks/use-crumbs.ts";
import {getCampaignQueryOptions} from "@/tanstack/query/campaigns/get.ts";

import {DataTable} from "@/components/data-table/data-table";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import {useDataTable} from "@/hooks/use-data-table";
import {useSuspenseLeadsLabelsQuery} from "@/tanstack/query/leads/labels/list.ts";
import {columns} from "@/components/leads/list/columns";

import {
	type TListOutputResultItem, useSuspenseCampaignLeadsQuery
} from "@/tanstack/query/campaigns/leads/list.ts";


import {AppBar} from "@/components/appbar/bar.tsx";
import SidebarLayout from "@/components/sidebar/layout.tsx";
import {ScrollArea} from "@/components/ui/scroll-area-custom.tsx";

const typedSearch = dataTableSearchOptions<TListOutputResultItem>();

export const Route = createFileRoute(
	'/dashboard/campaigns/$campaignId/settings',
)({
	component     : Page,
	validateSearch: createStandardSchemaV1(typedSearch, {
		partialOutput: true
	}),
	loaderDeps    : ({search}) => (search),
	loader        : async ({params, context, deps}) => {
		const campaign = await context.queryClient.ensureQueryData(
			getCampaignQueryOptions(({id: params.campaignId}))
		);

		return {
			campaign,
			crumbs: crumbs(
				{title: 'Dashboard', link: {to: '/dashboard'}},
				{title: 'Campaigns', link: {to: '/dashboard/campaigns'}},
				{
					title: campaign?.name || "??", link: {
						to: `/dashboard/campaigns/${params.campaignId}`,
					}
				},
				{
					title: 'Settings'
				}
			),
		};
	},
});

function Page() {
	const params = Route.useParams();
	const [{page, perPage}] = useQueryStates(typedSearch);

	const loaderData = Route.useLoaderData();

	const pagination = {
		page   : page ?? DEFAULT_PAGE_INDEX,
		perPage: perPage ?? DEFAULT_PAGE_SIZE,
	};

	// we just need to know the schema
	const dummyColumns = columns({sequencesTotal: 0, labels: []});

	const {filter} = useTableRouteFilters<TListOutputResultItem, typeof Route.id>(Route.id, dummyColumns);
	const {sort} = useTableRouteSorters<TListOutputResultItem, typeof Route.id>(Route.id, dummyColumns);


	const campaignLeads = useSuspenseCampaignLeadsQuery({
		input: {
			campaignId: loaderData.campaign.id,
			paginate  : {
				limit : pagination.perPage,
				cursor: pagination.page,
			},
			filter, sort
		},
	});

	const labels = useSuspenseLeadsLabelsQuery({
		input: {
			projectId: `${loaderData.campaign.projectId}`,
			paginate : {
				limit: 100,
			},
		}
	});

	const totalRows = campaignLeads.data?.paginate.total || 0;
	const totalPages = Math.ceil(totalRows / pagination.perPage);


	const {table} = useDataTable({
		data        : campaignLeads.data?.data || [],
		columns     : columns({
			sequencesTotal: campaignLeads.data?.data[0]?.sequences?.total || 0,
			labels        : labels.data?.data || [],
		}),
		pageCount   : totalPages,
		getRowId    : (row) => row.id,
		history     : "push",
		initialState: {
			columnPinning: {right: ["actions"]},
			pagination   : {
				pageIndex: pagination.page,
				pageSize : pagination.perPage
			}
		},
	});

	return (
		<SidebarLayout open={false}>
			<AppBar hideSidebarTrigger={true}/>

			<ScrollArea>
				<h1 className={"mx-6 my-10 text-4xl font-normal text-center"}>Campaign settings</h1>

				<Tabs defaultValue="leads">
					<div className="border-b">
						<TabsList variant="underline" className={"mx-auto"}>
							<TabsTab value="leads">Leads</TabsTab>
							<TabsTab value="sequences">Sequences</TabsTab>
							<TabsTab value="schedule">Schedule</TabsTab>
							<TabsTab value="settings">Settings</TabsTab>
						</TabsList>
					</div>
					<TabsPanel value="leads" className={"w-full pt-6"}>
						<DataTable table={table}>
							<DataTableToolbar className={"px-6 py-2"} table={table}>
								<CampaignLeadsListPicker campaignId={params.campaignId}/>
							</DataTableToolbar>
						</DataTable>
					</TabsPanel>

					<TabsPanel value="sequences" className={"w-full"}>
						{/*<Sequences sequences={null}/>*/}
					</TabsPanel>

					<TabsPanel value="schedule" className={"w-full"}>
						schedule
					</TabsPanel>

					<TabsPanel value="settings" className={"w-full"}>
						settings
					</TabsPanel>
				</Tabs>
			</ScrollArea>
		</SidebarLayout>
	);
}
