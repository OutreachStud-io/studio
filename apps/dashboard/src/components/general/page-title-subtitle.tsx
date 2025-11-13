import * as React from "react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Spinner} from "@/components/ui/spinner";

import {cn} from "@/lib/utils";


export type TStatsMainProps = {
	title: string | React.ReactNode;
	description?: string;
	showLoading?: boolean;
}

export function PageTitleSubtitle(p: TStatsMainProps & React.HTMLProps<HTMLDivElement>) {
	const {
			  title,
			  description,
			  className,
			  showLoading,
			  ...rest
		  } = p;

	return (
		<Card className={cn(
			"bg-transparent border-0 p-0 shadow-none",
			className,
		)} {...rest}>
			<CardHeader className="flex flex-col items-stretch border-b py-4! px-0 xl:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6">
					<CardTitle className={"flex justify-between"}>
						<div className={"self-center flex items-center gap-1"}>
							{showLoading && (
								<Spinner
									className={cn("text-muted-foreground")}
								/>
							)}
							{title}
						</div>
					</CardTitle>
					<CardDescription>
						{description}
					</CardDescription>
				</div>
			</CardHeader>
		</Card>
	);
}
