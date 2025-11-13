import {labelTextColor} from "@/components/leads/labels/label.tsx";
import {cn} from "@/lib/utils.ts";
import React from "react";

import {useDebounce} from "@uidotdev/usehooks";
import {ChevronsUpDownIcon, Tag} from "lucide-react";

import {Button} from "@/components/ui/button.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";

import {useAppStore} from "@/store/app.ts";
import {useLeadsLabelsQuery} from "@/tanstack/query/leads/labels/list.ts";


interface PickerComboboxProps {
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
}

export function LabelPickerCombobox(
	{
		value: controlledValue,
		onValueChange,
		placeholder = "Select label..."
	}: PickerComboboxProps = {}
) {
	const [open, setOpen] = React.useState(false);
	const [internalValue, setInternalValue] = React.useState("");
	const [search, setSearch] = React.useState("");
	const throttledSearch = useDebounce(search, 500);

	// Use controlled value if provided, otherwise use internal state
	const value = controlledValue ?? internalValue;
	const setValue = onValueChange ?? setInternalValue;

	const appStore = useAppStore();

	const query = useLeadsLabelsQuery({
		input: {
			projectId : `${appStore.selectedProjectId}`,
			pagination: {
				limit: 20,
			},
			filter    : [{
				field   : "name",
				type    : "string",
				value   : throttledSearch,
				operator: "icontains",
			}]
		},
	});

	// get the selected value label
	const selectedLabel = query.data?.data.find((c) => c.id === value);

	// modal - otherwise the popover is not scrollable if this component is
	// rendered inside a sheet
	return (
		<Popover open={open} onOpenChange={setOpen} modal>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between min-w-0"
				>
					<span className="truncate text-left min-w-0 flex-1 text-muted-foreground flex items-center  gap-2">
						{selectedLabel && (
							<Tag className={cn(labelTextColor(selectedLabel.type))}/>
						)}
						{value ? selectedLabel?.name : placeholder}
					</span>

					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="min-w-[var(--radix-popper-anchor-width)] border-input p-0"
				align="start"
			>
				<Command shouldFilter={false} className={"p-0"}>
					<CommandInput
						placeholder="Search"
						value={search}
						onValueChange={(v) => setSearch(v)}
					/>

					<CommandList>
						{query.isLoading ? (
							<CommandEmpty>Loading labels...</CommandEmpty>
						) : query.data?.data.length === 0 ? (
							<CommandEmpty>No labels found.</CommandEmpty>
						) : (
							<CommandGroup>
								{query.data?.data.map((c) => (
									<CommandItem
										key={c.id}
										value={c.id}
										onSelect={(currentValue) => {
											setValue(currentValue === value ? "" : currentValue);
											setOpen(false);
										}}
										className={"flex items-start"}
									>
										<Tag
											className={cn(
												"size-3 text-muted-foreground mt-1",
												labelTextColor(c.type)
											)}
										/>
										{c.name}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
