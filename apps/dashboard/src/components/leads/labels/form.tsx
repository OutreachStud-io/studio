import React from "react";
import {Tag} from "lucide-react";

import isEmail from "validator/lib/isEmail";

import {isDefinedError} from "@orpc/client";
import {useForm, useStore} from "@tanstack/react-form";
import {Button} from "@/components/ui/button.tsx";
import {useMutation} from "@tanstack/react-query";
import {formFieldIsInvalid} from "@/tanstack/query/forms/util.ts";

import {schema} from "@outreachstudio/orpc/schema";
import type {TContract} from "@outreachstudio/orpc/contract";

import {ScrollArea} from "@/components/ui/scroll-area-custom";

import {cn} from "@/lib/utils.ts";
import {tanstackClient} from "@/orpc/client.ts";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Field, FieldDescription, FieldLabel, FieldError} from "@/components/ui/field.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

import {LabelPickerCombobox} from "@/components/leads/labels/picker-combobox.tsx";
import {LeadsListPickerCombobox} from "@/components/leads/lists/picker-combobox.tsx";
import {labelTextColor} from "@/components/leads/labels/label.tsx";
import {CampaignPickerCombobox} from "@/components/campaigns/picker-combobox.tsx";


export function LeadsLabelsCreateUpdateForm(
	{
		className,
		onSuccess,
		record
	}: {
		onSuccess?: () => void
		className?: string;
		record?: TContract["LeadsLabels"]["GetOutput"]
	} & React.ComponentProps<"form">) {

	const {mutate: createM} = useMutation(tanstackClient.leadsLabels.create.mutationOptions({}));
	const {mutate: updateM} = useMutation(tanstackClient.leadsLabels.update.mutationOptions({}));

	type TValue = TContract["LeadsLabels"]["CreateInput"]

	const form = useForm({
		defaultValues: {
			type          : "positive",
			isGlobal      : true,
			useAIDetection: false,
			...record || {},
		} as TContract["LeadsLabels"]["CreateInput"],
		onSubmit     : async ({formApi, value}) => {
			const mutate = record ? updateM : createM;

			mutate(value, {
				onError  : (error) => {
					if (error) {
						if (isDefinedError(error)) {
							switch (error.code) {
								case "INPUT_VALIDATION_FAILED":
									const fields = error.data?.fieldErrors;
									if (fields) {
										for (const fieldName in fields) {
											const fieldErrors = fields[fieldName as keyof typeof fields];
											if (fieldErrors && fieldErrors.length > 0) {
												formApi.fieldInfo[fieldName as keyof TValue]
													.instance?.setErrorMap({
													onSubmit: [{
														message: fieldErrors.join(", "),
													}],
												});
											}
										}
									}
									break;
							}
						}
					}
				},
				onSuccess: () => {
					formApi.reset();
					onSuccess?.();
				}
			},);
		},
		validators   : {
			onChange: schema.leadsLabels.insert,
		},
	});

	const nameFieldErrors = useStore(form.store, (state) => {
		return state.fieldMeta?.name?.errors;
	});

	const nameFieldIsInvalid = useStore(form.store, (state) => {
		// we need to replicate the logic from formFieldIsInvalid here because I can't seem to extract the fieldApi
		// from the state only so i can pass it to formFieldIsInvalid
		return state.fieldMeta.name?.isTouched && !state.fieldMeta.name?.isValid;
	});

	// https://tanstack.com/form/v1/docs/framework/react/guides/reactivity
	// we need to turn these fields reactive so we know when they are changed because
	// they control the visibility of other fields
	const triggerPauseCampaign = useStore(form.store, (state) => state.values.triggerPauseCampaign);
	const isGlobal = useStore(form.store, (state) => state.values.isGlobal);
	const useAIDetection = useStore(form.store, (state) => state.values.useAIDetection);
	const triggerMoveToOtherList = useStore(form.store, (state) => state.values.triggerMoveToOtherList);
	const triggerCallWebhook = useStore(form.store, (state) => state.values.triggerCallWebhook);
	const triggerNotifyVialEmail = useStore(form.store, (state) => state.values.triggerNotifyVialEmail);
	const triggerApplyLabelAfterPeriod = useStore(form.store, (state) => state.values.triggerApplyLabelAfterPeriod);
	const triggerAutoRemoveLabel = useStore(form.store, (state) => state.values.triggerAutoRemoveLabel);

	const typeOptions = schema.leadsLabels.select.shape.type.options;

	return (
		<form className={cn("overflow-hidden w-full h-full flex flex-col", className)} onSubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}>
			<ScrollArea type={"hover"} viewportClassName="flex flex-col gap-6 flex-1 mb-4">
				<div className={"border-t pt-4 w-full px-4"}>
					<InputGroup>
						<InputGroupAddon>
							<form.Field
								name="type"
								children={(field) => {
									return (
										<Select
											name={field.name}
											value={field.state.value || ""}
											onValueChange={(v) => {
												field.handleChange(v as unknown as TContract["LeadsLabels"]["GetOutput"]["type"]);
											}}
										>
											<SelectTrigger
												className="px-0 pl-2 w-full border-none bg-transparent! ring-0 focus:ring-0 focus:border-transparent">
												<SelectValue/>
											</SelectTrigger>
											<SelectContent>
												{typeOptions.map((option) => (
													<SelectItem key={option} value={option}>
														<Tag className={labelTextColor(option)}/>

														{/* Hide the text when selected */}
														<span className={"[button_&]:hidden"}>
															{option}
														</span>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									);
								}}
							/>
						</InputGroupAddon>
						<form.Field
							name="name"
							children={(field) => {
								console.log(field.state.meta.errorMap);

								return (
									<InputGroupInput
										className={"w-full"}
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="ex: Out of office"
										autoComplete="off"
									/>
								);
							}}
						/>
					</InputGroup>

					{nameFieldIsInvalid && (
						<FieldError className={"mt-1"} errors={nameFieldErrors}/>
					)}
				</div>

				<form.Field
					name="description"
					children={(field) => {
						const isInvalid = formFieldIsInvalid(field);

						return (
							<Field className="border-t pt-4 w-full px-4" data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Description</FieldLabel>
								<Textarea
									id={field.name}
									name={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder=""
									autoComplete="off"
								/>
								{isInvalid && (
									<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
								)}
							</Field>
						);
					}}
				/>


				<form.Field
					name="isGlobal"
					children={(field) => {
						const isInvalid = formFieldIsInvalid(field);

						return (
							<Field className={"border-t pt-4 w-full px-4"} data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Availability</FieldLabel>
								<FieldDescription className={"!text-pretty"}>
									Set this label to be available globally across all projects,
									or limit it to the currently selected project and (optionally)
									a campaign.
								</FieldDescription>

								<Field orientation="horizontal" data-invalid={isInvalid}>
									<Checkbox
										id={field.name}
										name={field.name}
										checked={field.state.value || false}
										onCheckedChange={(checked) =>
											field.handleChange(checked === true)
										}
									/>
									<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
										Globally available
									</FieldLabel>
								</Field>
							</Field>
						);
					}}
				/>


				<form.Field
					name="campaignId"
					children={(field) => {
						const isInvalid = formFieldIsInvalid(field);
						return (
							<Field className={cn(
								"pt-4 w-full px-4",
								isGlobal && "hidden"
							)} data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Campaign (optional)</FieldLabel>
								<FieldDescription>
									Select a campaign to limit this label to only be applicable to leads
									from that campaign.
								</FieldDescription>

								<CampaignPickerCombobox
									value={field.state.value || ""}
									onValueChange={field.handleChange}
								/>

								{isInvalid && (
									<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
								)}
							</Field>
						);
					}}
				/>

				<form.Field
					name="useAIDetection"
					children={(field) => {
						const isInvalid = formFieldIsInvalid(field);

						return (
							<Field className={cn(
								"border-t pt-4 w-full px-4"
							)} data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Use AI detection</FieldLabel>
								<FieldDescription className={"!text-pretty"}>
									Use your AI identification prompt to automatically apply this label
									to leads based on their reply content.
								</FieldDescription>

								<Field orientation="horizontal" data-invalid={isInvalid}>
									<Checkbox
										id={field.name}
										name={field.name}
										checked={field.state.value || false}
										onCheckedChange={(checked) =>
											field.handleChange(checked === true)
										}
									/>
									<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
										Use AI detection
									</FieldLabel>
								</Field>

								{isInvalid && (
									<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
								)}
							</Field>
						);
					}}
				/>

				<form.Field
					name="aiIdentificationPrompt"
					children={(field) => {
						const isInvalid = formFieldIsInvalid(field);
						return (
							<Field className={cn(
								"pt-4 w-full px-4",
								!useAIDetection && "hidden"
							)} data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>AI prompt</FieldLabel>
								<FieldDescription>
									The AI prompt to help identify the content that should be marked with this
									label.
									Leave empty for manual only labeling.
								</FieldDescription>

								<Textarea
									id={field.name}
									name={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
								/>
								{isInvalid && (
									<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
								)}
							</Field>
						);
					}}
				/>


				<Field className={"border-t pt-4 w-full px-4"}>
					<FieldLabel>Triggers</FieldLabel>
					<FieldDescription>
						Select the triggers that will be applied to leads when this label is assigned.

						You can leave this empty to only use the label for visual identification and
						grouping/filtering purposes.
					</FieldDescription>
				</Field>


				<div className="grid gap-2">
					<form.Field
						name="triggerBlacklistLead"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Blacklist lead
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerPauseCampaign"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Pause campaign for lead
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>

					<form.Field
						name="triggerPauseCampaignResumeAfterDays"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={cn(
									"w-full px-4 my-2",
									!triggerPauseCampaign && "hidden"
								)} data-invalid={isInvalid}>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => {
											field.handleChange(parseInt(`${e.target.value}`, 10));
										}}
										aria-invalid={isInvalid}
										placeholder={"Days to wait before resuming the campaign for lead"}
										type={"number"}
									/>
									{isInvalid && (
										<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
									)}
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerMoveToOtherList"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Move lead to other list
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>

					<form.Field
						name="triggerMoveToOtherListId"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);
							return (
								<Field className={cn(
									"w-full px-4 mb-4 mt-2",
									!triggerMoveToOtherList && "hidden"
								)} data-invalid={isInvalid}>
									<LeadsListPickerCombobox
										value={field.state.value || ""}
										onValueChange={field.handleChange}
										placeholder={"New list to move the lead to"}
									/>
									{isInvalid && (
										<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
									)}
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerCallWebhook"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Call webhook
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>

					<form.Field
						name="triggerCallWebhookUrl"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={cn(
									"w-full px-4 mb-4 mt-2",
									!triggerCallWebhook && "hidden"
								)} data-invalid={isInvalid}>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder={"Webhook url"}
									/>
									{isInvalid && (
										<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
									)}
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerNotifyVialEmail"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Send email notification
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerNotifyViaEmailEmails"
						validators={{
							onChange: ({value, fieldApi}) => {
								// no validation if the trigger is not even selected
								// @TODO: move this to schema
								if (!triggerNotifyVialEmail) return undefined;

								const emails = `${value}`.split(",").map(e => e.trim()).filter(Boolean);

								for (const email of emails) {
									if (!isEmail(email)) {
										return {
											message: `Invalid email: ${email}`
										};
									}
								}

								return undefined;
							}
						}}
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={cn(
									"w-full px-4 mb-4 mt-2",
									!triggerNotifyVialEmail && "hidden"
								)} data-invalid={isInvalid}>
									<Textarea
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder={"Emails to notify, comma separated"}
									/>
									{isInvalid && (
										<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
									)}
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerRemoveLeadFromCampaign"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Remove lead from campaign
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerApplyLabelAfterPeriod"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Apply other label after period
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>

					<form.Field
						name="triggerApplyLabelAfterPeriodDelay"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={cn(
									"w-full px-4 mt-2",
									!triggerApplyLabelAfterPeriod && "hidden"
								)} data-invalid={isInvalid}>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => {
											field.handleChange(parseInt(`${e.target.value}`, 10));
										}}
										aria-invalid={isInvalid}
										placeholder={"Days to wait before applying the new label"}
										type={"number"}
									/>
									{isInvalid && (
										<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
									)}
								</Field>
							);
						}}
					/>

					<form.Field
						name="triggerApplyLabelAfterPeriodLabelId"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);
							return (
								<Field className={cn(
									"w-full px-4 mb-4",
									!triggerApplyLabelAfterPeriod && "hidden"
								)} data-invalid={isInvalid}>
									<LabelPickerCombobox
										value={field.state.value || ""}
										onValueChange={field.handleChange}
										placeholder={"New label to apply after above period"}
									/>
									{isInvalid && (
										<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
									)}
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerAutoRemoveLabel"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={"w-full px-4"} data-invalid={isInvalid}>
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<Checkbox
											id={field.name}
											name={field.name}
											checked={field.state.value || false}
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<FieldLabel className={"text-muted-foreground"} htmlFor={field.name}>
											Autoremove label after period
										</FieldLabel>
									</Field>
								</Field>
							);
						}}
					/>


					<form.Field
						name="triggerAutoRemoveLabelDelay"
						children={(field) => {
							const isInvalid = formFieldIsInvalid(field);

							return (
								<Field className={cn(
									"w-full px-4 mb-4 mt-2",
									!triggerAutoRemoveLabel && "hidden"
								)} data-invalid={isInvalid}>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => {
											field.handleChange(parseInt(`${e.target.value}`, 10));
										}}
										aria-invalid={isInvalid}
										placeholder={"Days to wait before applying the label"}
										type={"number"}
									/>
									{isInvalid && (
										<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
									)}
								</Field>
							);
						}}
					/>
				</div>
			</ScrollArea>

			<div className="w-full flex items-end px-4">
				<Button type="submit" className={"w-full"}>
					{record ? "Update" : "Create"} label
				</Button>
			</div>
		</form>
	);
}
