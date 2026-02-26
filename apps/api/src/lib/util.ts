import {z} from "zod";

import {isTruthy} from "remeda";

import {dataWithPagination, paginationSchema} from "@outreachstudio/orpc/util";


export const paginatedResponse = <T>(
	data: T, paginate: z.infer<ReturnType<typeof paginationSchema>>
): z.infer<ReturnType<typeof dataWithPagination<z.ZodType<T>>>> => {
	return {data, paginate};
};

export const isDebugMode = (): boolean => {
	return isTruthy(process.env.NODE_ENV! === "development");
};
