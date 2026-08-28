import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller, Session} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {schema} from "@outreachstudio/orpc/schema";
import {contract} from "@outreachstudio/orpc/contract";

import {paginatedResponse} from "@/lib/util";


@Controller()
export class LeadsListsController {
	@Implement(contract.leadsLists.list)
	list() {
		return implement(contract.leadsLists.list)
			.handler(({input}) => {
				return paginatedResponse(
					genData(input.paginate?.limit || 20), {
						limit : input.paginate?.limit || 10,
						cursor: 0,
						total : 100,
					}
				);
			});
	}

	@Implement(contract.leadsLists.get)
	get(@Session() session: Record<string, any>) {
		return implement(contract.leadsLists.get)
			.handler(({input}) => {
				const result = genData(1)[0];
				if (!result) {
					throw new Error('Failed to create lead label');
				}
				return result;
			});
	}
}

export const genData = (n: number) => {
	const results: z.infer<typeof schema.leadsLists.list> = [];

	for (let i = 0; i < n; i++) {
		results.push({
			id         : faker.string.uuid(),
			projectId  : faker.string.uuid(),
			name       : faker.company.name() + " List",
			description: faker.lorem.paragraph(),
			createdAt  : faker.date.past(),
		});
	}

	return results;
};
