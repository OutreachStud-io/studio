import ReactCountryFlag from "react-country-flag";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import {type TCountryIso, truncate} from "@/lib/utils";


export interface TLocation {
	country: TCountryIso;
	amount: number;
}

export interface TWorlMapTableProps {
	className?: string;
	locations?: TLocation[];
}

export function WorlMapTable(p: TWorlMapTableProps) {
	return (
		<div className={p.className}>
			<Table className={"!overflow-hidden"}>
				<TableBody className={"!overflow-hidden"}>
					{p.locations?.sort((a, b) => b.amount - a.amount).map((location, index) => (
						<TableRow key={index}>
							<TableCell>
								<div className="flex gap-1 items-center text-sm text-muted-foreground wrap-break-word">
									<ReactCountryFlag
										countryCode={location.country.code}
										svg
										style={{
											width : '1.5em',
											height: '1.5em',
										}}
										title={location.country.name}
										className={"opacity-70"}
									/> {truncate(location.country.name, 20)}
								</div>
							</TableCell>
							<TableCell className="text-right font-mono text-xs">{location.amount}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default WorlMapTable;
