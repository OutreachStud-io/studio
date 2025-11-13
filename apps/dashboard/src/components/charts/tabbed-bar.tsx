import * as React from "react";
import {
	Card,
	CardDescription,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";


import {cn} from "@/lib/utils";


import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export type TChartEntry = {
	date: string;
	count: number;
}

export type TChartDimension = {
	label: string;
	color?: string;
	entries: TChartEntry[];
}

export type TStatsMainProps = {
	title: string;
	description?: string;
	chartData: [TChartDimension, ...TChartDimension[]];// enforce at least one dimension to be present
	contentClassName?: string;
}

const chartConfigFromProps = (props: TStatsMainProps): ChartConfig => {
	return props.chartData.reduce((acc, dimension) => {
		acc[dimension.label] = {
			label: dimension.label,
			color: dimension.color || `--chart-1`,
		};
		return acc;
	}, {} as ChartConfig);
};

export function TabbedBarChart(p: TStatsMainProps & React.HTMLProps<HTMLDivElement>) {
	const {
			  title,
			  description,
			  chartData,
			  className,
			  contentClassName,
			  ...rest
		  } = p;

	const [activeChart, setActiveChart] = React.useState<TChartDimension>(chartData[0]);

	React.useEffect(() => {
		setActiveChart(chartData[0]);
	}, [chartData]);

	const total = React.useMemo(() => {
		return chartData.reduce((acc, dimension) => {
			const dimensionTotal = dimension.entries.reduce((sum, entry) => sum + entry.count, 0);
			return {
				...acc,
				[dimension.label]: dimensionTotal
			};
		}, {} as Record<string, number>);
	}, [chartData]);

	const chartConfig = chartConfigFromProps(p);

	return (
		<Card className={cn(
			className,
		)} {...rest}>
			<CardHeader className="flex flex-col items-stretch border-b !p-0 xl:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 xl:py-0!">
					<CardTitle className={"flex justify-between"}>
						<div className={"self-center"}>{title}</div>
					</CardTitle>
					<CardDescription>
						{description}
					</CardDescription>
				</div>
				<div className="flex">
					{Object.entries(total).map(([label, value]) => {
						const currentChart = chartData.find((d) => d.label === label)!;

						return (
							<button
								key={label}
								data-active={activeChart.label === label}
								className={cn(
									"cursor-pointer data-[active=true]:bg-muted/50 relative z-30",
									"flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left",
									"border-l first-of-type:border-l-0 xl:border-t-0 xl:border-l! sm:px-8 py-4",
									"whitespace-nowrap"
								)}
								onClick={() => setActiveChart(currentChart)}
							>
								<span className="text-muted-foreground text-xs">
									{label}
								</span>
								<span className="text-lg leading-none font-bold sm:text-3xl">
									{value.toLocaleString()}
								</span>
							</button>
						);
					})}
				</div>
			</CardHeader>

			<CardContent className={cn(
				"py-2 px-0", contentClassName)}
			>
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full m-0 p-0"
				>
					<BarChart
						data={chartData.find((d) => d.label === activeChart.label)?.entries || []}
					>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={12}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short", day: "numeric",
								});
							}}
						/>

						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey={activeChart.label}
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day  : "numeric",
											year : "numeric",
										});
									}}
								/>
							}
						/>

						<Bar
							dataKey={"count"}
							fillOpacity={"90%"}
							fill={`var(${chartConfig[activeChart.label]?.color || "--chart-1"})`}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
