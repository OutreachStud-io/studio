import {z} from "zod";
import {oc} from '@orpc/contract';

import {dataWithPagination, filterSchema, paginationInputSchema, sortSchema} from "@/util";

import schema, {selectSchema, listSchema} from '../schema/leads';

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
			listId: z.uuid(),
		})
			.extend(paginationInputSchema().shape)
			.extend(
				filterSchema(
					["firstName", "lastName", "email", "esp"]
				).shape
			)
			.extend(
				sortSchema(
					["firstName", "lastName", "email", "esp"]
				).shape
			)
			.partial()
			.required({
				listId: true,
			})
	)
	.output(dataWithPagination(listSchema));


export default {
	list, create
};
