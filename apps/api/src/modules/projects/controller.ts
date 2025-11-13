import {z} from "zod";
import {ORPCError} from '@orpc/server';
import {faker} from "@faker-js/faker";
import {Controller, Session, Param} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';
import {projectStatusTypes} from "@outreachstudio/dbschema";

import {paginatedResponse} from "@/lib/util";


import {contract} from '@outreachstudio/orpc/contract';
import {schema} from "@outreachstudio/orpc/schema";

@Controller()
export class ProjectsController {

	@Implement(contract.projects.get)
	get(@Session() session: Record<string, any>) {
		return implement(contract.projects.get)
			.handler(({input}) => {
				console.log("get");
				return defaultProject(session);
			});
	}

	@Implement(contract.projects.list)
	list(@Session() session: Record<string, any>) {
		return implement(contract.projects.list)
			.handler(({input}) => {
				return paginatedResponse(
					data(input.paginate?.limit || 10, session), {
						limit : input.paginate?.limit || 10,
						cursor: input.paginate?.cursor || 0,
						total : 100,
					}
				);
			});
	}

	@Implement(contract.projects.create)
	create(@Session() session: Record<string, any>) {
		return implement(contract.projects.create)
			.handler(({input}) => {
				if (input.name.length > 5) {
					throw new ORPCError('INPUT_VALIDATION_FAILED', {
						data: {
							formErrors : [],
							fieldErrors: {
								name: ['A project with this name already exists'],
							},
						},
					});
				}

				const result = data(1, session)[0];
				if (!result) {
					throw new Error('Failed to create lead label');
				}
				return result;
			});
	}

	@Implement(contract.projects.update)
	update(@Session() session: Record<string, any>) {
		return implement(contract.projects.update)
			.handler(({input}) => {
				if (input.icon) {
					session.icon = input.icon;
					session.save();
				}

				if (input.name && input.name.length > 5) {
					throw new ORPCError('INPUT_VALIDATION_FAILED', {
						data: {
							formErrors : [],
							fieldErrors: {
								name: ['A project with this name already exists'],
							},
						},
					});
				}

				const result = data(1, session)[0];
				if (!result) {
					throw new Error('Failed to create lead label');
				}
				return result;
			});
	}


	@Implement(contract.projects.remove)
	remove(@Param('id') id: string) {
		return implement(contract.projects.remove)
			.handler(({input}) => {
				console.log(id);
			});
	}
}

const fakeCollaborators = faker.helpers.arrayElements(
	Array.from({length: faker.number.int({min: 1, max: 30})}, () => ({
		id    : faker.string.uuid(),
		name  : faker.person.fullName(),
		email : faker.internet.email(),
		avatar: faker.image.avatar(),
	})), {min: 10, max: 10}
);

const defaultProject = (session: Record<string, any>): any => {
	const sent = faker.number.int({min: 100, max: 100000});
	const bounced = faker.number.int({min: 0, max: 0.05 * sent});
	const opened = faker.number.int({min: 0, max: (sent - bounced) * 0.5});
	const replied = faker.number.int({min: 0, max: opened * 0.2});

	return {
		// static id to match the value on the client
		id           : "cdc39c27-8e82-4107-a4c3-54c6b66fd327",
		status       : projectStatusTypes.active,
		icon         : session.icon || "command",
		name         : faker.company.name(),
		createdAt    : faker.date.past(),
		stats        : {
			sent,
			opened,
			bounced,
			replied
		},
		counters     : {
			leadsLists: faker.number.int({min: 1, max: 5}),
			leads     : faker.number.int({min: 8000, max: 1000000000}),
			campaigns : faker.number.int({min: 0, max: 50}),
		},
		collaborators: {
			list : faker.helpers.arrayElements(
				fakeCollaborators, {min: Math.min(5, fakeCollaborators.length), max: fakeCollaborators.length}
			),
			count: faker.number.int({min: fakeCollaborators.length, max: fakeCollaborators.length + 5}),
		}
	};
};

const data = (n: number, session: Record<string, any>) => {
	const results: z.infer<typeof schema.projects.list> = [defaultProject(session)];

	for (let i = 1; i < n; i++) {
		const sent = faker.number.int({min: 100, max: 100000});
		const bounced = faker.number.int({min: 0, max: 0.05 * sent});
		const opened = faker.number.int({min: 0, max: (sent - bounced) * 0.5});
		const replied = faker.number.int({min: 0, max: opened * 0.2});

		let archivedAt: Date | undefined;
		let pausedAt: Date | undefined;

		const status = faker.helpers.arrayElement(Object.values(projectStatusTypes));

		if (status === projectStatusTypes.archived) {
			archivedAt = faker.date.past();
		}

		if (status === projectStatusTypes.paused) {
			pausedAt = faker.date.past();
		}

		results.push({
			id           : faker.string.uuid(),
			status,
			icon         : faker.helpers.arrayElement([
				"command",
				"youtube",
				"wifi",
				"weight",
				"trash",
				"tractor",
				"thermometer",
				"speaker",
				"stars",
				"sparkles",
			]),
			name         : faker.company.name(),
			createdAt    : faker.date.past(),
			archivedAt, pausedAt,
			stats        : {
				sent,
				opened,
				bounced,
				replied
			},
			counters     : {
				leadsLists: faker.number.int({min: 1, max: 5}),
				leads     : faker.number.int({min: 8000, max: 1000000000}),
				campaigns : faker.number.int({min: 0, max: 50}),
			},
			collaborators: {
				list : faker.helpers.arrayElements(
					fakeCollaborators, {min: Math.min(5, fakeCollaborators.length), max: fakeCollaborators.length}
				),
				count: faker.number.int({min: fakeCollaborators.length, max: fakeCollaborators.length + 5}),
			}
		});
	}


	return results;
};
