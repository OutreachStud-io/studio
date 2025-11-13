import {z} from 'zod';

// https://orpc.unnoq.com/docs/openapi/error-handling
export const generalErrors = <T extends z.ZodObject<any>>(schema: T) => ({
	BAD_REQUEST : {},
	UNAUTHORIZED: {},
	RATE_LIMITED: {
		data: z.object({
			retryAfter: z.number(),
		}),
	},
});

export const formErrors = <T extends z.ZodObject<any>>(schema: T) => {
	type SchemaKeys = Extract<keyof z.infer<T>, string>;
	const keys = Object.keys(schema.shape) as SchemaKeys[];

	if (keys.length === 0) {
		throw new Error("Schema must have at least one field for filtering");
	}

	// Create a partial object where each field can have an array of error messages
	const fieldErrorsShape = keys.reduce((acc, key) => {
		acc[key] = z.array(z.string()).optional();
		return acc;
	}, {} as Record<SchemaKeys, z.ZodOptional<z.ZodArray<z.ZodString>>>);

	return {
		INPUT_VALIDATION_FAILED: {
			data: z.object({
				formErrors : z.array(z.string()),
				fieldErrors: z.object(fieldErrorsShape),
			}),
		},
	};
};
