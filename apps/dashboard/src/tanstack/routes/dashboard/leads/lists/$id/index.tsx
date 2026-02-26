import React from "react";

import {createFileRoute} from '@tanstack/react-router';
import {createStandardSchemaV1, useQueryStates} from 'nuqs';

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

import {DataTable} from "@/components/data-table/data-table";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import {useDataTable} from "@/hooks/use-data-table";
import {columns} from "@/components/leads/list/columns";

import {useAppStore} from "@/store/app.ts";

import {
	type TListOutputResult as TListShowOutputResult, getLeadsListsGetQueryOptions
} from "@/tanstack/query/leads/lists/get.ts";


import {
	type TListOutputResultItem, useLeadsListQuery
} from "@/tanstack/query/leads/list.ts";


import {AppBar} from "@/components/appbar/bar.tsx";
import SidebarLayout from "@/components/sidebar/layout.tsx";
import {ScrollArea} from "@/components/ui/scroll-area-custom.tsx";

export const MyUrl = (id: string) => `/dashboard/leads/lists/${id}/`;

const typedSearch = dataTableSearchOptions<TListShowOutputResult>();

export const Route = createFileRoute(
	"/dashboard/leads/lists/$id/",
)({
	component     : Page,
	validateSearch: createStandardSchemaV1(typedSearch, {
		partialOutput: true
	}),
	loaderDeps    : ({search}) => (search),
	loader        : async ({params, context, deps}) => {
		const list = await context.queryClient.ensureQueryData(getLeadsListsGetQueryOptions(params));

		return {
			list,
			crumbs: crumbs(
				{title: 'Dashboard', link: {to: '/dashboard'}},
				{title: 'Leads', link: {to: '/dashboard/leads'}},
				{title: 'Lists', link: {to: '/dashboard/leads/lists'}},
				{title: list.name}
			),
		};
	},
});

function Page() {
	const params = Route.useParams();
	const [{page, perPage}] = useQueryStates(typedSearch);
	const appStore = useAppStore();

	const loaderData = Route.useLoaderData();

	const pagination = {
		page   : page ?? DEFAULT_PAGE_INDEX,
		perPage: perPage ?? DEFAULT_PAGE_SIZE,
	};

	// we just need to know the schema
	const dummyColumns = columns();

	const {filter} = useTableRouteFilters<TListOutputResultItem, typeof Route.id>(Route.id, dummyColumns);
	const {sort} = useTableRouteSorters<TListOutputResultItem, typeof Route.id>(Route.id, dummyColumns);


	const listLeads = useLeadsListQuery({
		input: {
			listId  : params.id,
			paginate: {
				limit : pagination.perPage,
				cursor: pagination.page,
			},
			filter, sort
		},
	});

	const totalRows = listLeads.data?.paginate.total || 0;
	const totalPages = Math.ceil(totalRows / pagination.perPage);


	const {table} = useDataTable({
		data        : listLeads.data?.data || [],
		columns     : columns(),
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
				<h1 className={"mx-6 my-10 text-4xl font-normal text-center"}>List settings</h1>

				<Tabs defaultValue="leads">
					<div className="border-b">
						<TabsList variant="underline" className={"mx-auto"}>
							<TabsTab value="leads">Leads</TabsTab>
							<TabsTab value="settings">Settings</TabsTab>
						</TabsList>
					</div>
					<TabsPanel value="leads" className={"w-full pt-6"}>
						<DataTable table={table}>
							<DataTableToolbar className={"px-6 py-2"} table={table}/>
						</DataTable>
					</TabsPanel>

					<TabsPanel value="settings" className={"w-full"}>
						settings
					</TabsPanel>
				</Tabs>
			</ScrollArea>
		</SidebarLayout>
	);
}
