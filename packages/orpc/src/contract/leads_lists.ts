import {z} from "zod";

import {oc} from '@orpc/contract';

import {dataWithPagination, filterSchema, paginationInputSchema} from "@/util";


import schema, {selectSchema, listSchema} from '../schema/leads_lists';

export const create = oc
	.route({
		method: 'POST',
		path  : `/`
	})
	.input(schema.insert)
	.output(schema.select);


export const list = oc
	.route({method: 'GET', path: `/`})
	.input(
		z.object({
			projectId: z.string(),
		})
			.extend(paginationInputSchema().shape)
			.partial()
			.required({
				projectId: true
			})
	)
	.output(dataWithPagination(listSchema));


export default {
	list, create
};
