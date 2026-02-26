import React from "react";

import {useLocation} from "@tanstack/react-router";
import {Link} from "@tanstack/react-router";
import {DynamicIcon, type IconName} from 'lucide-react/dynamic';

import {cn} from "@/lib/utils";


import {useAppStore} from "@/store/app.ts";
import {useProjectQuery} from "@/tanstack/query/projects/get.ts";

import {Stats} from "@/components/sidebar/stats";
import {NavUser} from "@/components/sidebar/nav/user";
import {ThemmeToggle} from "@/components/general/theme-toggle";
import {ProjectSwitcher} from "@/components/sidebar/project-switcher";


import {
	SidebarCustom,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar-custom";


import {
	Cog,
	ChartPie,
	Inbox,
	Blocks,
	List,
	MailIcon,
	Send,
	Users,
	Waypoints,
	CloudLightning,
	Lightbulb,
	ShieldX,
	Webhook,
	RectangleEllipsis,
	Tags,
	TextCursorInput,
	Mailbox,
} from "lucide-react";

import {Badge} from "@/components/ui/badge";

export type TSidebarNavItem = {
	title: string;
	url: string;
	icon: React.ComponentType<any>;
	isActive?: boolean;
	items?: Omit<TSidebarNavItem, 'items'>[]
}

export type TSidebarProjects = {
	name: string;
	logo: React.ComponentType<any>;
	plan: string;
}

// Default sidebar navigation items
const navItems: TSidebarNavItem[] = [
	{
		title   : "Campaigns",
		url     : "/dashboard/campaigns",
		icon    : Send,
		isActive: true,
		items   : [
			{
				title: "All",
				icon : Lightbulb,
				url  : "/dashboard/campaigns",
			},
			{
				title: "Active",
				icon : List,
				url  : "/dashboard/campaigns/list",
			},
			{
				title: "Analytics",
				icon : ChartPie,
				url  : "/dashboard/campaigns/analytics",
			},
		],
	},
	{
		title   : "Inbox",
		url     : "/dashboard/inbox",
		icon    : Inbox,
		isActive: false,
	},
	{
		title   : "Prospects",
		url     : "/dashboard/leads/lists",
		icon    : Users,
		isActive: false,
	},
	{
		title   : "Email accounts",
		url     : "/dashboard/email-accounts",
		icon    : MailIcon,
		isActive: false,
	},
	{
		title   : "Transactional",
		url     : "/dashboard/transactional",
		icon    : CloudLightning,
		isActive: false,
	},
	{
		title   : "Proxies",
		url     : "/dashboard/proxies",
		icon    : Waypoints,
		isActive: false,
	},
	{
		title   : "Settings",
		url     : "/dashboard/settings",
		icon    : Cog,
		isActive: false,
		items   : [
			{
				title: "API",
				icon : RectangleEllipsis,
				url  : "/dashboard/settings/api",
			},
			{
				title: "Block list",
				icon : ShieldX,
				url  : "/dashboard/settings/blocklist",
			},
			{
				title: "Webhooks",
				icon : Webhook,
				url  : "/dashboard/settings/webhooks",
			},
			{
				title: "Integrations",
				icon : Blocks,
				url  : "/dashboard/settings/integrations",
			},
			{
				title: "Reply labels",
				icon : Tags,
				url  : "/dashboard/settings/reply-labels",
			},
			{
				title: "Additional fields",
				icon : TextCursorInput,
				url  : "/dashboard/settings/additional-fields",
			},
			{
				title: "ESP matching",
				icon : Mailbox,
				url  : "/dashboard/settings/esp",
			},
		],
	},
];


export function AppSidebar(
	{
		...props
	}: React.ComponentProps<typeof SidebarCustom>
) {
	const {pathname} = useLocation();
	const appStore = useAppStore();
	const projectQ = useProjectQuery({
		input: {
			id: appStore.selectedProjectId!
		}
	});

	const activeMainNavItem = navItems.find((item) => {
		return item.url === pathname.split("/").slice(0, 3).join("/");
	});

	return (
		<SidebarCustom
			collapsible="icon"
			className="overflow-hidden *:data-[sidebar=sidebar]:flex-row py-2 pr-0"
			{...props}
		>
			{/* This is the first sidebar */}
			{/* We disable collapsible and adjust width to icon. */}
			{/* This will make the sidebar appear as icons. */}

			<SidebarCustom
				collapsible="none"
				className="md:w-[calc(var(--sidebar-width-icon)+10px)] border bg-background rounded-lg"
			>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								size={"default"}
								className="bg-muted!"
								isActive={pathname === "/dashboard"}
							>
								<Link to="/dashboard">
									<DynamicIcon
										name={projectQ.data?.icon as IconName || "loader"}
										className={cn(
											"text-primary cursor-pointer size-4",
											projectQ.isLoading && "animate-spin",
										)}
									/>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				{/* pt-4 to make the icons on the same level with the child sidebar on the right. */}
				<SidebarContent className={"justify-center"}>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{navItems?.map((item, index) => (
									<SidebarMenuItem key={item.title} className={"relative"}>
										<SidebarMenuButton
											tooltip={{
												children: item.title,
												hidden  : false,
											}}
											onClick={() => {

											}}
											size={"default"}
											isActive={activeMainNavItem?.url === item.url}
											className="group/statusbadge"
											asChild={true}
										>
											<a href={item.url}>
												<item.icon/>

												{index === 1 && (
													<Badge
														variant="destructive"
														className={"group-hover/statusbadge:hidden absolute top-2 right-0 w-1 h-1 p-0"}

													>&nbsp;</Badge>
												)}
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<ThemmeToggle/>
					<NavUser user={{
						name : "shadcn",
						email: "m@example.com",
					}}/>
				</SidebarFooter>
			</SidebarCustom>

			<SidebarCustom collapsible="none" className="group-data-[state=collapsed]:hidden!">
				<SidebarHeader className="ml-2 border-b p-0 pr-2">
					<ProjectSwitcher/>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup className="pl-2 pt-6">
						<SidebarGroupContent>
							<SidebarMenu>
								{activeMainNavItem?.items?.map((item, index) => {
									const isActive = pathname === item.url;

									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild isActive={isActive} suppressHydrationWarning={true}
											>
												<a href={item.url} className={cn(
													"gap-3 hover:text-primary!",
													isActive && "text-sidebar-accent-foreground! hover:text-sidebar-accent-foreground! hover:opacity-90",
													!isActive && "hover:bg-sidebar-darker!",
												)}>
													<item.icon/>
													{item.title}
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarGroup className="flex-1 justify-end pb-0">
						<SidebarGroupContent>
							<Stats
								sendCapacity={1000}
								sentToday={123}
								toSendToday={300}
								activeCampaigns={5}
								totalCampaigns={7}
								earnings={1200}
							/>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</SidebarCustom>
		</SidebarCustom>
	);
}
