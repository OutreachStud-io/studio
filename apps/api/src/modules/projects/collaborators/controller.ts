import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {schema} from "@outreachstudio/orpc/schema";
import {contract} from "@outreachstudio/orpc/contract";

import {paginatedResponse} from "@/lib/util";


@Controller()
export class ProjectsCollaboratorsController {
	@Implement(contract.projectsCollaborators.list)
	list() {
		return implement(contract.projectsCollaborators.list)
			.handler(({input}) => {
				return paginatedResponse(
					data(input.paginate?.limit || 20), {
						limit : input.paginate?.limit || 10,
						cursor: 0,
						total : 100,
					}
				);
			});
	}
}

const data = (n: number) => {
	const results: z.infer<typeof schema.users.list> = [];

	for (let i = 0; i < n; i++) {
		results.push({
			id       : faker.string.uuid(),
			name     : faker.person.fullName(),
			email    : faker.internet.email(),
			createdAt: faker.date.past(),
			avatar   : faker.image.avatar(),
		});
	}

	return results;
};
