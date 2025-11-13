import React from 'react';

import {useCrumbs} from "@/hooks/use-crumbs.ts";
import {Link} from "@tanstack/react-router";

import {Separator} from "@/components/ui/separator";
import {SidebarTrigger} from "@/components/ui/sidebar-custom";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export type TSiteHeaderProps = {
	action?: React.ReactNode;
	hideSidebarTrigger?: boolean; // Show the sidebar trigger (hamburger menu)
}

const SquashableMinLength = 4;// Minimum number of crumbs to enable squashing
const SquashableStartIndex = 1; // Index after which crumbs can be squashed
const SquashableEndIndex = 2; // Index before which crumbs can be squashed

const shouldBeSquashed = (current: number, total: number) => {
	return total > SquashableMinLength && current > SquashableStartIndex && current < total - SquashableEndIndex;
};

export function AppBar(p: TSiteHeaderProps) {
	const crumbs = useCrumbs();

	const squashedCrumbs = crumbs.filter((crumb, index) => {
		return shouldBeSquashed(index, crumbs.length);
	});

	return (
		<header
			className="@container/appbar flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full px-6 pl-5! lg:gap-2 lg:px-6">
				<div className="flex flex-1 items-center ">
					{p.hideSidebarTrigger !== true && (
						<>
							<SidebarTrigger className="-ml-1"/>
							<Separator
								orientation="vertical"
								className="mx-2 data-[orientation=vertical]:h-4"
							/>
						</>
					)}

					<Breadcrumb className="hidden sm:block">
						<BreadcrumbList>
							{crumbs.map((crumb, index) => {
								const isLast = index === crumbs.length - 1;

								if (shouldBeSquashed(index, crumbs.length)) {
									if (index === SquashableStartIndex + 1) {
										return (
											<React.Fragment key={index}>
												<BreadcrumbItem>
													<DropdownMenu>
														<DropdownMenuTrigger
															className="flex items-center gap-1">
															<BreadcrumbEllipsis className="size-4"/>
															<span className="sr-only">Toggle menu</span>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="start">
															{squashedCrumbs.map((item, idx) => (
																<DropdownMenuItem
																	key={idx}
																	className="cursor-pointer"
																>
																	<Link
																		to={item.link!.to}
																		className={"text-muted-foreground max-w-50 truncate inline-block"}
																	>{item.title}</Link>
																</DropdownMenuItem>
															))}
														</DropdownMenuContent>
													</DropdownMenu>
												</BreadcrumbItem>
												<BreadcrumbSeparator> / </BreadcrumbSeparator>
											</React.Fragment>
										);
									}
								}

								return (
									<React.Fragment key={index}>
										<BreadcrumbItem>
											{!isLast && crumb.link && (
												<Link
													to={crumb.link!.to}
													className={"text-primary max-w-50 truncate inline-block"}
												>{crumb.title}</Link>
											)}

											{isLast && (
												<>{crumb.title}</>
											)}
										</BreadcrumbItem>

										{!isLast && <BreadcrumbSeparator> / </BreadcrumbSeparator>}
									</React.Fragment>
								);
							})}
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				{p.action && (
					<div className="hidden sm:block">
						{p.action}
					</div>
				)}
			</div>
		</header>
	);
}
