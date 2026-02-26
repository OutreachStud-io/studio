import {z} from 'zod';
import {createORPCClient, onError, ORPCError} from '@orpc/client';
import {ValidationError} from '@orpc/contract';
import {ResponseValidationPlugin} from '@orpc/contract/plugins';
import type {ContractRouterClient} from '@orpc/contract';
import {OpenAPILink} from '@orpc/openapi-client/fetch';
import {createTanstackQueryUtils} from '@orpc/tanstack-query';

import {contract} from "@outreachstudio/orpc/contract";
import {apiKey, apiUrl} from "@/constants.ts";

// https://orpc.unnoq.com/docs/openapi/client/openapi-link#using-client-context
interface ClientContext {

}

const openApiLink = new OpenAPILink<ClientContext>(contract, {
	url         : apiUrl,
	headers     : async ({context}) => ({
		'x-api-key': apiKey
	}),
	fetch       : (request, init) => {
		return globalThis.fetch(request, {
			...init,
			credentials: 'include', // Include cookies for cross-origin requests
		});
	},
	interceptors: [
		onError((error) => {
			if (
				error instanceof ORPCError
				&& error.code === 'BAD_REQUEST'
				&& error.cause instanceof ValidationError
			) {
				// If you only use Zod you can safely cast to ZodIssue[]
				const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

				throw new ORPCError('INPUT_VALIDATION_FAILED', {
					status : 422,
					message: z.prettifyError(zodError),
					data   : z.flattenError(zodError),
					cause  : error.cause,
				});
			} else if (error instanceof ValidationError) {
				const zodError = new z.ZodError(error.issues as z.core.$ZodIssue[]);

				throw new ORPCError('INPUT_VALIDATION_FAILED', {
					status : 422,
					message: z.prettifyError(zodError),
					data   : z.flattenError(zodError),
					cause  : error.cause,
				});
			} else {
				console.error("orpc client error", error instanceof ValidationError);
			}
		}),
	],
	plugins     : [
		new ResponseValidationPlugin(contract),
	]
});

export const client: ContractRouterClient<typeof contract, ClientContext>
				 = createORPCClient(openApiLink);
export const tanstackClient = createTanstackQueryUtils(client);
