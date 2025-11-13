import * as React from "react";

import {cn} from "src/lib/utils";

function Frame(
	{className, ...props}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="frame"
			className={cn(
				"relative flex flex-col rounded-md bg-muted",
				className
			)}
			{...props}
		/>
	);
}

function FramePanel(
	{className, ...props}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="frame-panel"
			className={cn(
				"relative bg-clip-padding mb-1",
				"not-has-[table]:bg-card not-has-[table]:p-2 bg-primary-foreground!",
				"before:pointer-events-none before:absolute before:inset-0",
				"has-[table]:before:hidden dark:bg-clip-border text-sm",
				className
			)}
			{...props}
		/>
	);
}

function FrameHeader(
	{className, ...props}: React.ComponentProps<"header">) {
	return (
		<header
			data-slot="frame-panel-header"
			className={cn("flex flex-col px-3 py-3", className)}
			{...props}
		/>
	);
}

function FrameTitle(
	{className, ...props}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="frame-panel-title"
			className={cn("text-sm font-semibold", className)}
			{...props}
		/>
	);
}

function FrameDescription(
	{
		className,
		...props
	}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="frame-panel-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function FrameFooter(
	{className, ...props}: React.ComponentProps<"footer">) {
	return (
		<footer
			data-slot="frame-panel-footer"
			className={cn("flex flex-col gap-1 px-3 py-2", className)}
			{...props}
		/>
	);
}

export {
	Frame,
	FramePanel,
	FrameHeader,
	FrameTitle,
	FrameDescription,
	FrameFooter,
};
