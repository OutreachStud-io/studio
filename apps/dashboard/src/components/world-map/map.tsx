import {DiagonalPattern} from "@/components/general/pattern";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import React, {useEffect, useState} from "react";
import {csv} from "d3-fetch";
import {scaleLinear} from "d3-scale";
import {
	ComposableMap,
	Geographies,
	Geography,
} from "react-simple-maps";


const geoUrl = "/features.json";

const getColorValue = (cssVar: string, fallback: string = 'var(--map-start)') => {
	if (typeof document === 'undefined') return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
};

export type TMapChartProps = {
	className?: string;
}

const MapChart = (p: TMapChartProps) => {
	const [data, setData] = useState([]);
	const colorScale = scaleLinear<string>()
		.range([getColorValue('--map-start'), getColorValue('--map-end')]);

	useEffect(() => {
		csv(`/vulnerability.csv`).then((data) => {
			// @ts-ignore
			setData(data);
		});
	}, []);

	return (
		<div className={cn(
			"h-full relative px-0",
			p.className
		)}>
			<DiagonalPattern/>

			{data.length > 0 ? (
				<ComposableMap
					projectionConfig={{
						rotate: [-15, 0, 0],
						scale : 110
					}}
					width={500}
					height={200}
					className={"absolute top-0 left-0 h-full w-full"}
				>

					<Geographies geography={geoUrl}>
						{({geographies}) =>
							geographies.map((geo) => {
								// @ts-ignore
								const d = data.find((s) => s.ISO3 === geo.id);
								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={d ? colorScale(d["1995"]) : getColorValue('--map-start')}
									/>
								);
							})
						}
					</Geographies>
				</ComposableMap>
			) : (
				<div className={"flex h-full gap-2 py-8"}>
					<Skeleton className="h-full w-full rounded-lg"/>
					<Skeleton className="h-full w-full rounded-lg"/>
					<Skeleton className="h-full w-full rounded-lg"/>
					<Skeleton className="h-full w-full rounded-lg"/>
				</div>
			)}
		</div>
	);
};

export default MapChart;
