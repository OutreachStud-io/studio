import {z} from "zod";
import {oc} from '@orpc/contract';
import type {InferContractRouterInputs, InferContractRouterOutputs} from '@orpc/contract';

import {formErrors, generalErrors} from "@/errors";
import {dataWithPagination, expandableFieldsSchema, filterSchema, paginationInputSchema} from "@/util";

import schema, {selectSchema, listSchema} from '../schema/projects';

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
	.errors({
		...generalErrors(schema.insert),
		...formErrors(schema.insert),
	})
	.input(schema.insert)
	.output(schema.select);

export const list = oc
	.route({method: 'GET', path: `/`})
	.input(
		z.object(
			paginationInputSchema().shape
		).extend(
			expandableFieldsSchema(["stats", "collaborators"]).shape
		).partial()
	)
	.output(dataWithPagination(listSchema));

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

export const remove = oc
	.route({method: 'DELETE', path: `/{id}`});

export type TProjects = {
	GetInput: InferContractRouterInputs<typeof get>;
	GetOutput: InferContractRouterOutputs<typeof get>;

	ListInput: InferContractRouterInputs<typeof list>;
	ListOutput: InferContractRouterOutputs<typeof list>;

	CreateInput: InferContractRouterInputs<typeof create>;
	CreateOutput: InferContractRouterOutputs<typeof create>;

	UpdateInput: InferContractRouterInputs<typeof update>;
	UpdateOutput: InferContractRouterOutputs<typeof update>;

	RemoveInput: InferContractRouterInputs<typeof remove>;
};


export default {
	get, list, create, update, remove
};
