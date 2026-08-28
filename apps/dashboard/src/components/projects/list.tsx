import {friendlyNumber} from "@/lib/utils.ts";
import React, {Suspense} from "react";

import {Mails, UsersRound, List, TrendingUp} from "lucide-react";

import {useNavigate} from "@tanstack/react-router";
import {useAppStore} from "@/store/app.ts";
import {useProjectQuery} from "@/tanstack/query/projects/get.ts";

import {Badge} from "@/components/ui/badge.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {LoadingIndicator} from "@/components/general/loading-indicator.tsx";
import {ProjectStatus} from "@/components/projects/project/status.tsx";
import {useScreenSize} from "@/hooks/use-screen-size.tsx";


import {
	Frame,
	FrameFooter,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from "@/components/ui/frame";

import {ProjectIconUpdater} from "@/components/projects/project/icon-updater.tsx";
import {ProjectOptions} from "@/components/projects/project/options.tsx";
import {EmptyProjects} from "@/components/projects/empty.tsx";
import {ProjectCollaborators} from "@/components/projects/project/collaborators.tsx";

import {useProjectsQuery} from "@/tanstack/query/projects/list.ts";

const LazyProgress = React.lazy(() =>
	import("@/components/projects/project/engagement-progress.tsx"));

export function ProjectsList(
	{}: {}
) {
	const appStore = useAppStore();
	const navigate = useNavigate({from: '/dashboard/'});
	const screenSize = useScreenSize();


	const {refetch: refetchSelectedProject} = useProjectQuery({
		input: {
			id: appStore.selectedProjectId!,
		}
	});

	const pageSize = screenSize.greaterThan("lg") ? 9 : screenSize.greaterThan("md") ? 8 : 8;

	const {data, refetch: refetchProjects} = useProjectsQuery({
		input: {
			pagination: {
				limit: pageSize,
			},
			expand    : ["collaborators"],
		},
	});

	if (data && data.data.length === 0) return <EmptyProjects className={"h-full"}/>;

	return (
		<div className={"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 select-none!"}>
			{data?.data.map((project) => (
				<Frame key={project.id} className={"rounded-md  bg-card!"}>
					<FrameHeader className={"flex flex-row justify-between items-center gap-2"}>
						<ProjectIconUpdater project={project} onSet={() => {
							appStore.selectedProjectId = project.id;
						}}/>

						<FrameTitle
							className={"flex-1 min-w-0 truncate font-semibold cursor-pointer"}
							onClick={() => {
								appStore.setSelectedProjectId(project.id);
								refetchSelectedProject();
								navigate({
									to: "/dashboard",
								});
							}}
						>
							{project.name}
						</FrameTitle>

						<Badge
							variant="outline"
							className="text-primary bg-primary/10 border-none ml-2"
						>
							<TrendingUp className="h-4 w-4 text-positive"/>
							<span>5.2%</span>
						</Badge>

						<ProjectOptions project={project}/>
					</FrameHeader>
					<FramePanel className={"p-0! bg-card!"}>
						<Suspense fallback={
							<LoadingIndicator
								message={"Loading chart..."}
								className={"bg-transparent w-full gap-1 min-h-52"}
							/>
						}>
							<LazyProgress
								project={project}
								className={"py-2 max-h-[140px] w-full p-1"}
							/>
						</Suspense>

						<div className="grid grid-cols-3 border-t border-b bg-card text-muted-foreground text-xs">
							<Tooltip>
								<TooltipTrigger asChild>
									<div
										className={"text-center py-2 border-r flex flex-row items-center justify-center gap-1"}>

										<UsersRound
											className={"size-4"}/> {friendlyNumber(project.counters?.leads || 0)}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									Leads
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<div
										className={"text-center py-2 border-r flex flex-row items-center justify-center gap-1"}>
										<Mails
											className={"size-4"}/> {friendlyNumber(project.counters?.campaigns || 0)}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									Campaigns
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<div
										className={"text-center flex flex-row items-center justify-center gap-1"}>
										<List
											className={"size-4"}/> {friendlyNumber(project.counters?.leadsLists || 0)}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									Lead lists
								</TooltipContent>
							</Tooltip>
						</div>
					</FramePanel>
					<FrameFooter className={"flex flex-row items-center justify-between"}>
						<ProjectCollaborators
							className={"opacity-80 hover:opacity-100"}
							project={project}/>
						<ProjectStatus project={project}/>
					</FrameFooter>
				</Frame>
			))}
		</div>
	);
}
