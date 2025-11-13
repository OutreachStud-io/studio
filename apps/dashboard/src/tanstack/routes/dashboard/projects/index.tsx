import React from "react";

import {ProjectsCreateUpdateDialog} from "@/components/projects/create.tsx";
import {ScrollArea} from "@/components/ui/scroll-area-custom.tsx";


import {CirclePlus} from "lucide-react";
import {createFileRoute} from '@tanstack/react-router';

import {Button} from "@/components/ui/button";
import {AppBar} from "@/components/appbar/bar";
import {Container} from "@/components/general/container.tsx";
import SidebarLayout from "@/components/sidebar/layout";
import {ProjectsList} from "@/components/projects/list.tsx";

export const Route = createFileRoute('/dashboard/projects/')({
	component: Page,
});

function Page() {

	return (
		<SidebarLayout>
			<AppBar
				action={
					<ProjectsCreateUpdateDialog
						trigger={
							<Button size={"sm"} variant={"secondary"}>
								<CirclePlus/> Create project
							</Button>
						}
					/>
				}
			/>

			<ScrollArea>
				<Container variant={"fixed"} className="py-6 h-full">
					<ProjectsList/>
				</Container>
			</ScrollArea>
		</SidebarLayout>
	);
}
