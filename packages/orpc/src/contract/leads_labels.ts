import {z} from "zod";
import type {InferContractRouterInputs, InferContractRouterOutputs} from '@orpc/contract';

import {formErrors, generalErrors} from "@/errors";

import {oc} from '@orpc/contract';

import {dataWithPagination, filterSchema, paginationInputSchema} from "@/util";


import schema, {selectSchema, listSchema} from '../schema/leads_labels';

export const get = oc
	.route({method: 'GET', path: `/show/{id}`})
	.input(z.object({
		id: z.uuid(),
	}))
	.output(selectSchema);

export const remove = oc
	.route({method: 'DELETE', path: `/{id}`});

export const create = oc
	.route({
		method: 'POST',
		path  : `/`
	})
	.errors({
		...generalErrors(schema.insert),
		...formErrors(schema.insert),
	})
	.input(schema.insert)
	.output(schema.select);

export const update = oc
	.route({
		method: 'PUT',
		path  : `/{id}`
	})
	.errors({
		...generalErrors(schema.update),
		...formErrors(schema.update),
	})
	.input(schema.update)
	.output(schema.select);

export const list = oc
	.route({
		method: 'GET',
		path  : `/`
	})
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

export type TLeadsLabels = {
	ListInput: InferContractRouterInputs<typeof list>;
	ListOutput: InferContractRouterOutputs<typeof list>;

	GetInput: InferContractRouterInputs<typeof get>;
	GetOutput: InferContractRouterOutputs<typeof get>;

	CreateInput: InferContractRouterInputs<typeof create>;
	CreateOutput: InferContractRouterOutputs<typeof create>;

	UpdateInput: InferContractRouterInputs<typeof update>;
	UpdateOutput: InferContractRouterOutputs<typeof update>;
};

export default {
	get, list, create, update, remove
};
