import {cn} from "@/lib/utils";
import React from "react";

export function DiagonalPattern({className, ...rest}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn(
			"absolute inset-0 pattern-diagonal-lines pattern-pattern",
			"pattern-bg-background pattern-size-2 pattern-opacity-20",
			className
		)} {...rest}/>

	);
}
