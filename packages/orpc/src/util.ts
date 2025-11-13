import {z} from 'zod';

export const periodFilters = [
	{label: 'Last 24 hours', value: 'last_24_hours'},
	{label: 'Last 7 days', value: 'last_7_days'},
	{label: 'Last 30 days', value: 'last_30_days'},
	{label: 'Last 60 days', value: 'last_60_days'},
	{label: 'Last 90 days', value: 'last_90_days'},
] as const;


export const timeIntervalFilterSchema = z.object({
	startDate: z.string().min(10).max(20).optional(),
	endDate  : z.string().min(10).max(20).optional(),
	preset   : z.enum(
		Object.values(
			periodFilters
		).map(
			(p) => p.value
		)
	).default("last_30_days").optional(),
});

/**
 * Pagination schema - used for paginated endpoints OR
 * for inputs that support pagination (e.g. list endpoints)
 */

export type TPaginationInputParams = {
	limitMin?: number;
	limitMax?: number;
	defaultLimit?: number;
}

export const paginationSchema = (p?: TPaginationInputParams) => z.object({
	limit : z.number()
		.or(z.string()
			.transform(Number))
		.pipe(z.coerce.number()).out.min(p?.limitMin || 0).max(p?.limitMax || 100).optional().default(p?.defaultLimit || 20),
	cursor: z.number()
		.or(z.string()
			.transform(Number))
		.pipe(z.coerce.number()).out.min(0).default(0),
	total : z.number()
		.or(z.string()
			.transform(Number))
		.pipe(z.coerce.number()).out.min(0).optional(),
});

export const paginationInputSchema = (p?: TPaginationInputParams) => z.object({
	paginate: paginationSchema(p).omit({
		total: true
	}).optional(),
});

const filterOperatorSchema = z.enum([
	"equals", "not_equals", "contains", "icontains", "not_contains",
	"greater_than", "less_than", "greater_than_or_equal", "less_than_or_equal",
	"in", "not_in", "starts_with", "ends_with"
]);

const filterTypeSchema = z.enum([
	"string", "number", "boolean", "date", "datetime", "list"
]);

export type TFilterType = z.infer<typeof filterTypeSchema>;
export type TFilterOperator = z.infer<typeof filterOperatorSchema>;

export const filterSchema = (fields: string[]) => {
	return z.object({
		filter: z.array(z.object({
			field   : z.enum(fields),
			type    : filterTypeSchema,
			value   : z.any(),
			operator: filterOperatorSchema,
		}))
	});
};

export const sortSchema = (fields: string[]) => {
	return z.object({
		sort: z.array(z.object({
			field: z.literal(fields),
			type : z.enum(["asc", "desc"]),
		}))
	});
};


export const expandableFieldsSchema = (fields: string[]) => {
	return z.object({
		expand: z.array(z.object({
			field: z.literal(fields),
		}))
	});
};


/**
 * Helper to create a schema with data and pagination
 * @param schema - zod schema for the data
 * @returns zod schema with data and pagination schema
 */

export const dataWithPagination = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({
		data    : schema,
		paginate: paginationSchema(),
	});

export default {
	timeIntervalFilterSchema,
	paginationSchema,
	dataWithPagination,
};

export type TSortSchema = z.infer<ReturnType<typeof sortSchema>>;
export type TFilterSchema = z.infer<ReturnType<typeof filterSchema>>;
