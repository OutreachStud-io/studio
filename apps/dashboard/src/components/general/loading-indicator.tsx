import React from "react";

import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import {Spinner} from "@/components/ui/spinner";

type LoadingIndicatorProps = {
	message?: string;
}

export function LoadingIndicator(
	{
		message,
		...rest
	}: LoadingIndicatorProps & React.ComponentProps<typeof Item>) {
	return (
		<Item variant="muted" {...rest}>
			<ItemMedia>
				<Spinner/>
			</ItemMedia>
			<ItemContent>
				<ItemTitle className="line-clamp-1">{message}</ItemTitle>
			</ItemContent>
		</Item>
	);
}
