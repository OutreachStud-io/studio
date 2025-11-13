import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {contract} from '@outreachstudio/orpc/contract';

import {schema} from "@outreachstudio/orpc/schema";

@Controller()
export class CampaignsSequencesVersionsController {

	@Implement(contract.campaignsSequencesVersions.list)
	list() {
		return implement(contract.campaignsSequencesVersions.list)
			.handler(({input}) => {
				return data(input.sequenceId);
			});
	}
}

const data = (sequenceId: string) => {
	const results: z.infer<typeof schema.campaignsSequencesVersions.list> = [];

	for (let i = 0; i < faker.helpers.rangeToNumber({min: 2, max: 5}); i++) {
		results.push({
			id            : faker.string.uuid(),
			sequenceId    : sequenceId,
			contentSubject: faker.lorem.sentence(),
			contentBody   : faker.lorem.paragraphs(),
			createdAt     : faker.date.past(),
		});
	}

	return results;
};
