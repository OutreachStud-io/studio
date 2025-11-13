import React from "react";
import {toast} from "sonner";

import {useMutation} from "@tanstack/react-query";

import {cn} from "@/lib/utils";
import {tanstackClient} from "@/orpc/client.ts";
import {useAppStore} from "@/store/app.ts";
import {type TGetOutputResult} from "@/tanstack/query/projects/get.ts";

import {IconPicker, Icon, type IconName} from "@/components/ui/icon-picker";


export function ProjectIconUpdater(
	{
		project,
		onSet
	}: {
		// get the project instead of resolving it locally as we might
		// use this component in loops where multiple projects are rendered
		project?: TGetOutputResult
		onSet?: (icon: string) => void
	}
) {
	const appStore = useAppStore();

	const {mutate: mutateProject} = useMutation(tanstackClient.projects.update.mutationOptions({}));

	if (!project) {
		return <LoadingSpinner/>;
	}

	return (
		<IconPicker
			withTooltip={false}
			onValueChange={(icon) => {
				toast.promise(
					() =>
						new Promise((resolve, reject) => {
							if (!appStore.selectedProjectId) return reject("No project selected");

							mutateProject({
								id  : appStore.selectedProjectId,
								icon: icon as string,
							}, {
								onSuccess: () => {
									onSet && onSet(icon);
									resolve("");
								},
								onError  : () => {
									toast.error(
										"There was an error updating icon. Please try again");
								}
							});
						}),
					{
						loading: "Loading...",
						success: (data) => `Icon updated successfully`,
						error  : "Error",
					}
				);

			}}
			categorized={false}
		>
			<Icon
				name={project.icon as IconName}
				className={cn(
					"cursor-pointer size-4 text-primary",
				)}
			/>
		</IconPicker>
	);
}

const LoadingSpinner: React.FC<{ className?: string }> = ({className}) => (
	<Icon
		name={"loader"}
		className={cn(
			"cursor-pointer size-4 text-primary animate-spin",
		)}
	/>
);
