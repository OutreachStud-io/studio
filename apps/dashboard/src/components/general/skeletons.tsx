import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils.ts";

export function TableSkeleton(
	{
		className,
	}: { className?: string }) {
	return (
		<div className={cn(
			"flex items-center space-x-4", className
		)}>
			<div className="space-y-2">
				<Skeleton className="h-4 w-[500px]"/>
				<Skeleton className="h-4 w-[500px]"/>
				<Skeleton className="h-4 w-[500px]"/>
				<Skeleton className="h-4 w-[500px]"/>
			</div>
		</div>
	);
}

export function NavProjectSkeleton(
	{
		className,
	}: { className?: string }) {
	return (
		<div className={cn(
			"flex items-center", className
		)}>
			<div className="space-y-2">
				<Skeleton className="h-3 w-[200px]"/>
				<Skeleton className="h-3 w-[160px]"/>
			</div>
		</div>
	);
}
