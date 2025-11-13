import {campaignStatusTypes} from "@outreachstudio/dbschema";
import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller} from '@nestjs/common';

import {Implement, implement} from '@orpc/nest';

import {contract} from '@outreachstudio/orpc/contract';
import {schema} from "@outreachstudio/orpc/schema";

import {paginatedResponse} from "@/lib/util";

@Controller()
export class CampaignsController {

	@Implement(contract.campaigns.list)
	list() {
		return implement(contract.campaigns.list)
			.handler(({input}) => {
				return paginatedResponse(
					data(input.paginate?.limit || 10), {
						limit : input.paginate?.limit || 10,
						cursor: 0,
						total : 100,
					});
			});
	}

	@Implement(contract.campaigns.show)
	show() {
		return implement(contract.campaigns.show)
			.handler(({input}) => {
				return genCampaign();
			});
	}
}


const data = (n: number) => {
	const results: z.infer<typeof schema.campaigns.list> = [];

	for (let i = 0; i < n; i++) {
		results.push(genCampaign());
	}

	return results;
};

const randomCount = (
	min: number = 1, max: number = 100
) => Math.floor(Math.random() * max) + min;

export const genCampaign = () => {
	const sentCount = randomCount(100, 50000);
	const clickedCount = randomCount(10, 100);
	const openedCount = randomCount(100, 1500);
	const deliveredCount = randomCount(49000, 50000);
	const repliedCount = randomCount(10, clickedCount);
	const bouncedCount = randomCount(10, 50);
	const unsubscribedCount = randomCount(10, 50);
	const status = faker.helpers.arrayElement(Object.values(campaignStatusTypes));

	return {
		id           : faker.string.uuid(),
		projectId    : faker.string.uuid(),
		name         : faker.lorem.sentence(),
		description  : faker.lorem.paragraph(),
		createdAt    : faker.date.past(),
		updatedAt    : faker.date.past(),
		status,
		startsAt     : Math.random() < 0.5 ? faker.date.past() : undefined,
		endsAt       : status === "ended" ? faker.date.past() : undefined,
		tzSend       : Math.random() < 0.5,
		counters     : {
			leads       : randomCount(10034, 50000),
			sequences   : randomCount(1, 10),
			sent        : sentCount,
			opened      : openedCount,
			clicked     : clickedCount,
			replied     : repliedCount,
			bounced     : bouncedCount,
			unsubscribed: unsubscribedCount,
			delivered   : deliveredCount,
		},
		maxBounceRate: "0.5",
		stoppedReason: null,
	};
};
