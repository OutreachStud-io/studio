import React from "react";

import {AppSidebar} from "@/components/sidebar/sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar-custom";

// Separated layout component for the sidebar since we don't want to
// use the sidebar directives inside the NextJs App Router layouts
// due to the fact that we cannot set the open state on a per-page basis
export default function SidebarLayout(
	{
		children,
		open
	}: {
		children: React.ReactNode;
		open?: boolean;
	}
) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width"     : "calc(var(--spacing) * 72)",
					"--sidebar-width-icon": "calc(var(--spacing) * 10)",
					"--header-height"     : "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
			open={open}
			className={"pb-4"}
		>
			<AppSidebar variant="inset"/>

			<SidebarInset className={"border shadow-none! h-full pb-4 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:rounded-lg"}>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
