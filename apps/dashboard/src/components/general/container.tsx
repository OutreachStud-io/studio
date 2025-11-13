import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const containerVariants = cva("mx-auto", {
	variants       : {
		variant: {
			// fixed width, for content that shouldn't stretch too wide
			fixed: "w-full max-w-7xl px-4 lg:px-6",
			// no width restraints, just a full width container with padding
			full: "px-4 lg:px-6",
		},
	},
	defaultVariants: {
		variant: "full",
	},
});

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
	({className, children, variant, ...props}, ref) => {
		return (
			<div ref={ref} className={cn(containerVariants({variant}), className)} {...props}>
				{children}
			</div>
		);
	},
);

Container.displayName = "Container";

export {Container, containerVariants};
