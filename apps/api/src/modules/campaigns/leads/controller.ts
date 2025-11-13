import {genLeadLabels} from "@/modules/leads/labels/controller";
import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {schema} from "@outreachstudio/orpc/schema";
import {contract} from '@outreachstudio/orpc/contract';

import {espTypes, leadStatusTypes} from "@outreachstudio/dbschema";

import {paginatedResponse} from "@/lib/util";

@Controller()
export class CampaignsLeadsController {

	@Implement(contract.campaignsLeads.list)
	list() {
		return implement(contract.campaignsLeads.list)
			.handler(({input}) => {
				return paginatedResponse(
					generateLeads(input.paginate?.limit || 20), {
						limit : input.paginate?.limit || 10,
						cursor: 0,
						total : 100,
					}
				);
			});
	}
}

const generateLeads = (n: number) => {
	const results: z.infer<typeof schema.campaignsLeads.list> = [];
	const labels = genLeadLabels();
	const seqTotal = faker.number.int({min: 5, max: 10});

	for (let i = 0; i < n; i++) {
		const label = faker.helpers.arrayElement(labels);

		const lead = {
			id           : faker.string.uuid(),
			listId       : faker.string.uuid(),
			esp          : faker.helpers.arrayElement(Object.values(espTypes)),
			email        : faker.internet.email(),
			firstName    : faker.person.firstName(),
			lastName     : faker.person.lastName(),
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
		};

		results.push({
			id        : faker.string.uuid(),
			leadId    : lead.id,
			campaignId: faker.string.uuid(),
			labelId   : faker.string.uuid(),
			status    : faker.helpers.arrayElement(Object.values(leadStatusTypes)),
			sequences : {
				count: faker.number.int({min: 0, max: seqTotal}),
				total: seqTotal
			},
			lead, label
		});
	}

	return results;
};
