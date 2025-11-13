import {ProjectsCreateUpdateDialog} from "@/components/projects/create.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";

import {IconFolderCode} from "@tabler/icons-react";

import {
	Empty, EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";


export function EmptyProjects(props: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Empty {...props}>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconFolderCode/>
				</EmptyMedia>
				<EmptyTitle>No projects</EmptyTitle>
				<EmptyDescription>
					There are no projects to show
				</EmptyDescription>

				<EmptyContent>
					<ProjectsCreateUpdateDialog
						trigger={
							<Button>
								Create your first project
							</Button>
						}
					/>

				</EmptyContent>
			</EmptyHeader>
		</Empty>
	);
}
