import React from "react";

import {urls} from "@/lib/urls";

import type {TListOutputResult} from "@/tanstack/query/leads/lists/list.ts";

import {cn, friendlyNumber, percentFromValue} from "@/lib/utils";
import {Link} from "@tanstack/react-router";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {MyUrl} from "@/tanstack/routes/dashboard/leads/lists/$id";

export type TLeadsListsListProps = {
	className?: string;
	lists: TListOutputResult;
}

const Stat = (
	{
		label, value, className,
	}: {
		label: string;
		value: number;
		className?: string;
	}) => {
	return (
		<div
			className={cn(
				"relative flex flex-1 flex-col justify-center gap-1 border-t px-8",
				"py-4 text-left border-l first-of-type:border-l-0 xl:border-t-0 xl:border-l! relative",
				className
			)}
		>
			<span className="text-muted-foreground text-xs">
				{label}
			</span>
			<span className="text-lg leading-none font-light sm:text-3xl">
				{friendlyNumber(value)}
			</span>
		</div>
	);
};


export const LeadsListsList = (p: TLeadsListsListProps) => {
	if (!p.lists || p.lists.data.length === 0) {
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
			{p.lists!.data.map((list) => {
				return (
					<Link to={MyUrl(list.id)} key={list.id} className={"group/link"}>
						<Card
							className={"group border-0 border-b p-0 m-0 shadow-none! rounded-none! bg-transparent relative"}
						>
							<CardHeader className="gap-0 flex p-0 items-center">
								<div
									className="flex flex-1 flex-col justify-center px-6 py-5 xl:py-4">
									<CardTitle className={"flex z-99 transition-transform group-hover:translate-x-0.5"}>
										<div className={"flex gap-2 items-center mb-1"}>
											{list.name}
										</div>
									</CardTitle>
									<CardDescription
										className={"block overflow-hidden transition-transform group-hover:translate-x-0.5"}>
										<div className={"text-nowrap text-ellipsis max-w-[1px]"}>
											{list.description}
										</div>
									</CardDescription>
								</div>

								<div className="hidden xl:grid grid-cols-2">
									<Stat label={"Leads"} value={1230}/>
									<Stat label={"Campaigns"} value={Math.round(Math.random() * 3)}/>
								</div>
							</CardHeader>
						</Card>
					</Link>
				);
			})}
		</div>
	);
};
