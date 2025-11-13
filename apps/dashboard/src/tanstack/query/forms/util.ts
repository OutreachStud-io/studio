import type {AnyFieldApi} from "@tanstack/react-form";

export const formFieldIsInvalid = (field: AnyFieldApi) =>
	field.state.meta.isTouched && !field.state.meta.isValid;
