import {Controller, Session} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';
import {espTypes} from "@outreachstudio/dbschema";

import {faker} from "@faker-js/faker";

import {contract} from "@outreachstudio/orpc/contract";
import {paginatedResponse} from "@/lib/util";
import {schema} from "@outreachstudio/orpc/schema";
import {z} from "zod";

@Controller()
export class LeadsController {
	@Implement(contract.leads.list)
	list(@Session() session: Record<string, any>) {
		return implement(contract.leads.list)
			.handler(({input}) => {
				return paginatedResponse(
					generateLeads(input.paginate?.limit || 10), {
						limit : input.paginate?.limit || 10,
						cursor: input.paginate?.cursor || 0,
						total : 50,
					}
				);
			});
	}
}

const generateLeads = (n: number) => {
	const results: z.infer<typeof schema.leads.list> = [];

	for (let i = 0; i < n; i++) {

		const nameMaybe = faker.helpers.maybe(() => true);
		results.push({
			id           : faker.string.uuid(),
			listId       : faker.string.uuid(),
			esp          : faker.helpers.arrayElement(Object.values(espTypes)),
			email        : faker.internet.email(),
			firstName    : nameMaybe ? faker.person.firstName() : null,
			lastName     : nameMaybe ? faker.person.lastName() : null,
			city         : faker.location.city(),
			state        : faker.location.state(),
			country      : faker.location.country(),
			jobTitle     : faker.person.jobTitle(),
			company      : faker.company.name(),
			phone        : faker.phone.number({style: "international"}),
			industry     : faker.commerce.department(),
			notes        : faker.lorem.paragraph(),
			createdAt    : faker.date.past(),
			blacklistedAt: null,
		});
	}

	return results;
};
