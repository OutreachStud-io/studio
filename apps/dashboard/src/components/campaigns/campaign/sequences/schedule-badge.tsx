import {Badge} from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function ScheduleBadge({delayDays, isFirstSequence}: { delayDays: number, isFirstSequence: boolean }) {
	let label = "Immediately";

	if (!isFirstSequence) {
		if (delayDays === 0) {
			label = "Immediately after previous step";
		} else {
			label = `${delayDays} day${delayDays > 1 ? 's' : ''} after previous step`;
		}
	} else {
		if (delayDays > 0) {
			label = `${delayDays} day${delayDays > 1 ? 's' : ''} after enrollment`;
		} else {
			label = "Immediately after enrollment";
		}
	}


	return (
		<Select>
			<SelectTrigger className="bg-input w-auto border-none shadow-none text-xs p-2 py-1! h-6! cursor-pointer"
						size={"sm"}>
				<SelectValue placeholder={label}/>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">Light</SelectItem>
				<SelectItem value="dark">Dark</SelectItem>
				<SelectItem value="system">System</SelectItem>
			</SelectContent>
		</Select>
	);


}
