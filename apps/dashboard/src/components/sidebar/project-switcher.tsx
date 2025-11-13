import {NavProjectSkeleton} from "@/components/general/skeletons.tsx";
import {useProjectQuery} from "@/tanstack/query/projects/get.ts";
import * as React from "react";

import {ChevronsUpDown, Table, Plus} from "lucide-react";
import {DynamicIcon, type IconName} from "lucide-react/dynamic";
import {Link} from "@tanstack/react-router";

import {ProjectsCreateUpdateDialog} from "@/components/projects/create.tsx";
import {useAppStore} from "@/store/app.ts";
import {useProjectsQuery} from "@/tanstack/query/projects/list.ts";


import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar-custom";

export function ProjectSwitcher() {
	const {isMobile} = useSidebar();
	const appStore = useAppStore();
	const [projectCreateOpen, setProjectCreateOpen] = React.useState(false);

	const {data: projects, isLoading} = useProjectsQuery({
		input: {
			pagination: {
				limit: 10,
			}
		},
	});

	const {data: currentProject, isLoading: currentProjectIsLoading} = useProjectQuery({
		input: {
			id: appStore.selectedProjectId!,
		}
	});

	if (isLoading || currentProjectIsLoading) {
		return <NavProjectSkeleton className={"py-2"}/>;
	}

	if (!appStore.selectedProjectId) {
		return <NavProjectSkeleton className={"py-2"}/>;
	}

	if (!currentProject) {
		return <NavProjectSkeleton className={"py-2"}/>;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="default"
							className="pl-0! cursor-pointer h-10 m-0 my-1 hover:bg-transparent! hover:text-sidebar-foreground active:text-sidebar-primary rounded-none data-[state=open]:bg-sidebar-darker focus-visible:ring-offset-0 focus-visible:ring-0"
						>
							<div className="grid flex-1 text-left text-sm leading-tight text-primary">
								<span className="truncate font-medium">{currentProject.name}</span>
								<span className="truncate text-xs text-muted-foreground">Admin</span>
							</div>
							<ChevronsUpDown className="ml-auto"/>
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Projects
						</DropdownMenuLabel>

						{projects?.data.map((p, index) => (
							<DropdownMenuItem
								key={p.name}
								className="gap-2"
							>
								<div className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border">
									<DynamicIcon name={p.icon as IconName} className="size-3.5 shrink-0 text-primary"/>
								</div>
								<span className={"text-primary-lighter"}>{p.name}</span>
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator/>

						<DropdownMenuItem className="gap-2" asChild>
							<Link to="/dashboard/projects">
								<div className="flex size-6 items-center justify-center">
									<Table className="size-4"/>
								</div>
								<div className="text-muted-foreground font-medium">View all projects</div>
							</Link>
						</DropdownMenuItem>

						<DropdownMenuItem className="gap-2" onSelect={() => setProjectCreateOpen(true)}>
							<div
								className="flex size-6 items-center justify-center">
								<Plus className="size-4"/>
							</div>
							<div className="text-muted-foreground font-medium">Add project</div>
						</DropdownMenuItem>

					</DropdownMenuContent>
				</DropdownMenu>

				<ProjectsCreateUpdateDialog
					open={projectCreateOpen}
					onOpenChange={setProjectCreateOpen}
				/>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
