import React from "react";

import {useDebounce} from "@uidotdev/usehooks";
import {ChevronsUpDownIcon, Dot} from "lucide-react";
import Highlighter from "react-highlight-words";

import {Button} from "@/components/ui/button.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";

import {useAppStore} from "@/store/app.ts";
import {useLeadsListsQuery} from "@/tanstack/query/leads/lists/list.ts";


interface PickerComboboxProps {
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
}

export function LeadsListPickerCombobox(
	{
		value: controlledValue,
		onValueChange,
		placeholder = "Select leads list..."
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

	const query = useLeadsListsQuery({
		input: {
			projectId: `${appStore.selectedProjectId}`,
			paginate : {
				limit: 20,
			},
			filter   : [{
				field   : "name",
				type    : "string",
				value   : throttledSearch,
				operator: "icontains",
			}]
		},
	});

	// modal - otherwise the popover is not scrollable if this component is rendered inside a sheet
	return (
		<Popover open={open} onOpenChange={setOpen} modal>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between min-w-0"
				>
					<span className="truncate text-left min-w-0 flex-1 text-muted-foreground">
						{value
							? query.data?.data.find((c) => c.id === value)?.name
							: placeholder}
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
							<CommandEmpty>Loading lists...</CommandEmpty>
						) : query.data?.data.length === 0 ? (
							<CommandEmpty>No lists found.</CommandEmpty>
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
										<Dot
											className={"size-3 text-muted-foreground mt-1"}
										/>
										<Highlighter
											className={"text-muted-foreground"}
											highlightClassName="bg-positive"
											searchWords={[throttledSearch]}
											autoEscape={true}
											textToHighlight={c.name}
										/>
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
