import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsStringEnum,
} from "nuqs/server";

import {getFiltersStateParser, getSortingStateParser} from "@/lib/parsers";

export const cleanFiltersEmptyParams = <T extends Record<string, unknown>>(
	search: T
) => {
	const newSearch = {...search};

	Object.keys(newSearch).forEach((key) => {
		const value = newSearch[key];

		if (
			value === undefined || value === null ||
			value === "" || (typeof value === "number" && isNaN(value)) ||
			(Array.isArray(value) && value.length === 0)
		)
			delete newSearch[key];
	});

	if (Number(search.page) === DEFAULT_PAGE_INDEX) delete newSearch.page;
	if (Number(search.perPage) === DEFAULT_PAGE_SIZE) delete newSearch.perPage;

	return newSearch;
};

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Creates the schema to be used on the routes `validateSearch` method
 * that takes into account the schema for sorting and filtering based on the
 * provided columns from the table
 *
 * @template T is the table data type
 */

export const dataTableSearchOptions = <T>() => {
	return {
		flags: parseAsArrayOf(
			parseAsStringEnum(["advancedTable", "floatingBar"])
		),

		// pagination
		page   : parseAsInteger.withDefault(DEFAULT_PAGE_INDEX),
		perPage: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),

		// sorting - handled by nuqs in useDataTable hook
		sort: getSortingStateParser<T>(),

		// advanced! filtering - handled by nuqs in useDataTable hook
		filters     : getFiltersStateParser<T>(),
		joinOperator: parseAsStringEnum(["and", "or"]),
	};
};
