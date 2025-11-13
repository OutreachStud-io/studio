import {Bar, BarChart, XAxis, YAxis} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import type {TGetOutputResult} from "@/tanstack/query/projects/get.ts";

const chartConfig = {
	sent     : {
		label: "Sent",
		color: "var(--sidebar-ring)",
	},
	delivered: {
		label: "Delivered",
		color: "var(--sidebar-ring)",
	},
	opened   : {
		label: "Opened",
		color: "var(--sidebar-ring)",
	},
	replied  : {
		label: "Replied",
		color: "var(--sidebar-ring)",
	},
	bounced  : {
		label: "Bounced",
		color: "var(--sidebar-ring)",
	},
} satisfies ChartConfig;

export default function EngagementProgress(
	{
		project, className
	}: {
		project?: TGetOutputResult;
		className?: string
	}) {

	const sSent = project?.stats?.sent ?? 0;
	const sBounced = project?.stats?.bounced ?? 0;
	const sDelivered = sSent - sBounced;
	const sOpened = project?.stats?.opened ?? 0;
	const sReplied = project?.stats?.replied ?? 0;


	const chartData = [
		{dimension: "sent", count: sSent, fill: "var(--color-sent)"},
		{dimension: "delivered", count: sDelivered, fill: "var(--color-delivered)"},
		{dimension: "opened", count: sOpened, fill: "var(--color-opened)"},
		{dimension: "replied", count: sReplied, fill: "var(--color-replied)"},
		{dimension: "bounced", count: sBounced, fill: "var(--color-bounced)"},
	];

	return (
		<ChartContainer config={chartConfig} className={className}>
			<BarChart
				accessibilityLayer
				data={chartData}
				layout="vertical"
				margin={{
					left: 0,
				}}
				barSize={10}
			>
				<YAxis
					dataKey="dimension"
					type="category"
					tickLine={false}
					tickMargin={2}
					axisLine={false}
					tickFormatter={(value) =>
						chartConfig[value as keyof typeof chartConfig]?.label
					}
				/>
				<XAxis
					dataKey="count"
					type="number"
					hide
					domain={[0, 'dataMax']}
				/>

				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideIndicator/>}
				/>

				<Bar dataKey="count" layout="vertical" radius={5} minPointSize={10}/>
			</BarChart>
		</ChartContainer>
	);
}
