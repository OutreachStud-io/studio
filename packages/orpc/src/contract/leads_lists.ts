import {z} from "zod";

import {oc} from '@orpc/contract';

import {dataWithPagination, filterSchema, paginationInputSchema} from "@/util";


import schema, {selectSchema, listSchema} from '../schema/leads_lists';


export const get = oc
	.route({method: 'GET', path: `/{id}`})
	.input(z.object({
		id: z.uuid(),
	}))
	.output(selectSchema);

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

export const remove = oc
	.route({method: 'DELETE', path: `/{id}`});

export default {
	list, create, remove, get
};
