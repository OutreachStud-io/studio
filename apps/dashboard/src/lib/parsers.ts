import {z} from "zod";
import {createParser} from "nuqs/server";

import {dataTableConfig} from "src/config/data-table";

import type {
	ExtendedColumnFilter,
	ExtendedColumnSort,
} from "src/types/data-table";


export const getSortingStateParser = <TData>(
	columnIds?: string[] | Set<string>,
) => {
	const validKeys = columnIds
		? columnIds instanceof Set
			? columnIds
			: new Set(columnIds)
		: null;

	return createParser({
		parse    : (value) => {
			// if (validKeys && !validKeys.has(value.split("_")[0] || "")) {
			// 	return null;
			// }

			try {
				return value;
			} catch (error) {
				console.error(`failed to parse sorters: ${error}`);
				return null;
			}
		},
		serialize: (value) => value,
		eq       : (a, b) => {
			const aS = a.split("_");
			const bS = b.split("_");

			return aS.length === bS.length &&
				aS.every(
					(item, index) =>
						item === bS[index] && item === bS[index],
				);
		},
	});
};

const filterItemSchema = z.object({
	id      : z.string(),
	value   : z.union([z.string(), z.array(z.string())]),
	variant : z.enum(dataTableConfig.filterVariants),
	operator: z.enum(dataTableConfig.operators),
	filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const getFiltersStateParser = <TData>(
	columnIds?: string[] | Set<string>,
) => {
	const validKeys = columnIds
		? columnIds instanceof Set
			? columnIds
			: new Set(columnIds)
		: null;

	return createParser({
		parse    : (value) => {
			try {
				// Handle both string and already-parsed object cases
				const parsed = typeof value === 'string' ? JSON.parse(value) : value;
				const result = z.array(filterItemSchema).safeParse(parsed);

				if (!result.success) return null;

				if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
					return null;
				}

				return result.data as ExtendedColumnFilter<TData>[];
			} catch {
				return null;
			}
		},
		serialize: (value) => JSON.stringify(value),
		eq       : (a, b) =>
			a.length === b.length &&
			a.every(
				(filter, index) =>
					filter.id === b[index]?.id &&
					filter.value === b[index]?.value &&
					filter.variant === b[index]?.variant &&
					filter.operator === b[index]?.operator,
			),
	});
};
