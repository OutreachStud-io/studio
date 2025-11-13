import React from "react";

import {isDefinedError} from "@orpc/client";
import {useForm} from "@tanstack/react-form";
import {Button} from "@/components/ui/button.tsx";
import {useMutation} from "@tanstack/react-query";
import {formFieldIsInvalid} from "@/tanstack/query/forms/util.ts";

import {schema} from "@outreachstudio/orpc/schema";
import type {TContract} from "@outreachstudio/orpc/contract";
import type {TListOutputResult} from "@/tanstack/query/projects/list.ts";

import {Input} from "@/components/ui/input.tsx";
import {Field, FieldError} from "@/components/ui/field.tsx";

import {cn} from "@/lib/utils.ts";
import {tanstackClient} from "@/orpc/client.ts";


import {FormErrors} from "@/components/general/form-errors.tsx";

export function ProjectsCreateUpdateForm(
	{
		className,
		onSuccess,
		record
	}: {
		onSuccess?: () => void
		className?: string;
		record?: TListOutputResult
	} & React.ComponentProps<"form">) {
	const [formError, setFormError] = React.useState<string | null>(null);

	const {mutate: createM} = useMutation(tanstackClient.projects.create.mutationOptions({}));
	const {mutate: updateM} = useMutation(tanstackClient.projects.update.mutationOptions({}));

	type TValue = TContract["Projects"]["CreateInput"]

	const form = useForm({
		defaultValues: {
			name: "",
			...record || {},
		} as TContract["Projects"]["CreateInput"],

		onSubmit  : async ({formApi, value}) => {
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
						} else {
							setFormError(error.message);
						}
					}
				},
				onSuccess: () => {
					formApi.reset();
					onSuccess?.();
				}
			},);
		},
		validators: {
			onChange: schema.projects.insert,
		},
	});

	return (
		<form className={cn("flex flex-col", className)} onSubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}>
			{formError && (
				<FormErrors errors={[formError]}/>
			)}

			<form.Field
				name="name"
				children={(field) => {
					const isInvalid = formFieldIsInvalid(field);

					return (
						<Field className="pt-4 w-full" data-invalid={isInvalid}>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value || ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								aria-invalid={isInvalid}
								placeholder="Enter a project name"
								autoComplete="off"
							/>
							{isInvalid && (
								<FieldError className={"mt-1"} errors={field.state.meta.errors}/>
							)}
						</Field>
					);
				}}
			/>

			<div className="w-full flex items-end mt-4">
				<Button type="submit" className={"w-full"}>Submit</Button>
			</div>
		</form>
	);
}
