"use client";

import {TrendingUp} from "lucide-react";
import {Bar, BarChart, XAxis, YAxis} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@//components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@//components/ui/chart";

export const description = "A mixed bar chart";

const chartConfig = {
	sentiment : {
		label: "Sentiment",
	},
	percentage: {
		label: "Percentage",
	},
} satisfies ChartConfig;

export interface TSentimentChartWidgetProps {
	positive?: number;
	negative?: number;// percentages
	title?: string;
	subtitle?: string;
}

export function SentimentChartWidget(p: TSentimentChartWidgetProps) {
	return (
		<Card className="bg-card from-primary/55 to-card flex flex-col shadow-none">
			<CardHeader>
				<CardTitle>{p.title}</CardTitle>
				<CardDescription>{p.subtitle}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 items-center pb-0 ">
				<ChartContainer
					config={chartConfig}
					className="w-full max-h-[70px]">
					<BarChart
						accessibilityLayer
						data={[
							{sentiment: "Pos", percentage: p.positive, fill: "var(--positive)"},
							{sentiment: "Neg", percentage: p.negative, fill: "var(--destructive)"},
						]}
						layout="vertical"
						margin={{
							left: -20,
						}}
					>
						<YAxis
							dataKey="sentiment"
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value}
						/>

						<XAxis dataKey="percentage" type="number" hide/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel/>}
						/>
						<Bar dataKey="percentage" layout="vertical" radius={5}/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 leading-none font-medium">
					Trending up by 5.2% this month <TrendingUp className="h-4 w-4"/>
				</div>
				<div className="text-muted-foreground leading-none">
					Showing total percentage for the last 6 months
				</div>
			</CardFooter>
		</Card>
	);
}
