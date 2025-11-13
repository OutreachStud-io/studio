import {z} from "zod";
import {oc} from '@orpc/contract';
import type {InferContractRouterInputs, InferContractRouterOutputs} from '@orpc/contract';

import {formErrors, generalErrors} from "@/errors";
import {dataWithPagination,  filterSchema, paginationInputSchema} from "@/util";

import schema, {selectSchema, listSchema} from '../schema/users';

export const get = oc
	.route({method: 'GET', path: `/{projectId}/collaborators/{id}`})
	.input(z.object({
		id: z.uuid(),
	}))
	.output(selectSchema);

export const create = oc
	.route({
		method: 'POST',
		path  : `/{projectId}/collaborators`
	})
	.errors({
		...generalErrors(schema.insert),
		...formErrors(schema.insert),
	})
	.input(schema.insert)
	.output(schema.select);

export const list = oc
	.route({method: 'GET', path: `/{projectId}/collaborators`})
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

export const update = oc
	.route({
		method: 'PUT',
		path  : `/{projectId}/collaborators/{id}`
	})
	.errors({
		...generalErrors(schema.update),
		...formErrors(schema.update),
	})
	.input(schema.update)
	.output(schema.select);


export type TProjectsCollaborators = {
	GetInput: InferContractRouterInputs<typeof get>;
	GetOutput: InferContractRouterOutputs<typeof get>;

	ListInput: InferContractRouterInputs<typeof list>;
	ListOutput: InferContractRouterOutputs<typeof list>;

	CreateInput: InferContractRouterInputs<typeof create>;
	CreateOutput: InferContractRouterOutputs<typeof create>;

	UpdateInput: InferContractRouterInputs<typeof update>;
	UpdateOutput: InferContractRouterOutputs<typeof update>;
};


export default {
	get, list, create, update
};
