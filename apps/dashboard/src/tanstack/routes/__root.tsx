import {scan} from "react-scan";

scan({
	enabled: true,
});

import {ThemeProvider} from "@/components/providers/theme.tsx";
import {
	Outlet,
	HeadContent,
	Scripts,
	createRootRouteWithContext
} from "@tanstack/react-router";

import {NuqsAdapter} from 'nuqs/adapters/tanstack-router';

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import {Toaster} from "@/components/ui/sonner";

import {queryConfig} from "@/tanstack/query/config.ts";

import "@/styles/tailwind.css";
import "@/styles/styles.css";


export const Route = createRootRouteWithContext<{
	user: null
	queryClient: QueryClient
}>()({
	head     : () => ({
		meta : [
			{
				charSet: 'utf-8',
			},
			{
				name   : 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'OutreachStudio',
			},
		],
		links: [
			{rel: 'icon', href: '/favicon.ico'},
		],
	}),
	loader   : async () => {
		return {};
	},
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en" className={"h-full overflow-hidden"} suppressHydrationWarning={true}>
		<head>
			<HeadContent/>
		</head>

		<body className={"text-primary antialiased h-full flex flex-col"}>

		<QueryClientProvider client={new QueryClient(
			{
				defaultOptions: queryConfig
			}
		)}>
			<NuqsAdapter>
				<ThemeProvider defaultTheme="system">
					<Outlet/>
					<Toaster position="bottom-right"/>
				</ThemeProvider>
			</NuqsAdapter>
		</QueryClientProvider>
		<Scripts/>
		</body>
		</html>
	);
}
