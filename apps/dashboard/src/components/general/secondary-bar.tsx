import {cn} from "@/lib/utils";

export type TSecondaryBarProps = {
	className?: string;

	title?: React.ReactNode;
	action?: React.ReactNode;
}

export function SecondaryBar(p: TSecondaryBarProps) {
	const {className} = p;

	return (
		<div className={cn(
			"flex items-center justify-between px-6 border-b py-4",
			className,
		)}>
			<div className="text-sm text-gray-700">
				{p.title || ""}
			</div>

			<div className="flex space-x-2">
				{p.action}
			</div>
		</div>
	);
}
