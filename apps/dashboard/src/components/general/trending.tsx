import {IconTrendingDown, IconTrendingUp, IconMinus} from "@tabler/icons-react";

import {Badge} from "@/components/ui/badge";


export type Props = {
	A: number;
	B: number;
}

export function TrendingBadge(p: Props) {
	return (
		<Badge variant="outline" className={"bg-white"}>
			<TrendingIcon A={p.A} B={p.B}/>
			{(((p.A - p.B) / p.B * 100) || 0).toFixed(1)}%
		</Badge>
	);
}

export function TrendingIcon(p: Props) {
	return (
		<>
			{p.A != p.B && <>{(p.A > p.B) ? <IconTrendingUp className={"text-positive"}/> :
				<IconTrendingDown className={"text-destructive"}/>}</>}
			{p.A == p.B && <IconMinus/>}
		</>
	);
}

export function TrendingText(p: Props & {
	suffix?: string;
}) {
	return (
		<>
			{p.A != p.B && <>{(p.A > p.B) ? "Trending up" : "Trending down"}</>}
			{p.A == p.B && <>No change</>}
			{p.suffix && ` ${p.suffix}`}
		</>
	);
}
