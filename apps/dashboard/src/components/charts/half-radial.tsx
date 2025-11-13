"use client";

import {TrendingUp} from "lucide-react";
import {Label, PolarRadiusAxis, RadialBar, RadialBarChart} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export interface THalfRadialChartProps {
	percent: number;
	previousPercent?: number;
	color: string;
	label: string;
	title?: string;
	subtitle?: string;
}

export function HalfRadialChart(p: THalfRadialChartProps) {
	const chartConfig = {
		percent: {
			color: p.color || "var(--positive)",
		},
		full   : {
			color: "var(--background)",
		},
	} satisfies ChartConfig;

	return (
		<Card className="bg-card from-primary/55 to-card flex flex-col shadow-none">
			{p.title && (
				<CardHeader className="items-center pb-0">
					<CardTitle>{p.title}</CardTitle>
					{p.subtitle && (
						<CardDescription>{p.subtitle}</CardDescription>
					)}
				</CardHeader>
			)}
			<CardContent className="flex flex-1 items-center pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto w-full aspect-square max-h-[170px] max-w-[170px]"
				>
					<RadialBarChart
						data={[{percent: (p.percent / 100) * 180 || 0, full: 180 - ((p.percent / 100) * 180)}]}
						endAngle={180}
						innerRadius={80}
						outerRadius={100}
					>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel/>}
						/>
						<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
							<Label
								content={({viewBox}) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) - 16}
													className="fill-foreground text-2xl font-bold"
												>
													{p.percent}%
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 4}
													className="fill-muted-foreground"
												>
													{p.label}
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>

						<RadialBar
							dataKey="full"
							fill="var(--color-full)"
							stackId="a"
							className="stroke-transparent stroke-2"
						/>

						<RadialBar
							dataKey="percent"
							stackId="a"
							fill="var(--color-percent)"
							className="stroke-transparent stroke-2"
						/>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 text-sm -mt-15">
				<div className="flex items-center gap-2 leading-none font-medium">
					Trending up by 1.2% this month <TrendingUp className="h-4 w-4"/>
				</div>
				<div className="text-muted-foreground leading-none">
					Lorem ipsum dolor sit amet, consectetur
				</div>
			</CardFooter>
		</Card>
	);
}
