import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {notificationTypes} from "@outreachstudio/dbschema";
import {schema} from "@outreachstudio/orpc/schema";
import {contract} from '@outreachstudio/orpc/contract';

import {paginatedResponse} from "@/lib/util";

@Controller()
export class CampaignsNotificationsController {

	@Implement(contract.campaignsNotifications.list)
	list() {
		return implement(contract.campaignsNotifications.list)
			.handler(({input}) => {
				return paginatedResponse(
					generateNotifications(input.paginate?.limit || 20, input.campaignId), {
						limit : input.paginate?.limit || 10,
						cursor: 0,
						total : 100,
					});
			});
	}
}

const generateNotifications = (n: number, campaignId: string) => {
	const results: z.infer<typeof schema.campaignsNotifications.list> = [];

	for (let i = 0; i < n; i++) {
		results.push({
			id         : faker.string.uuid(),
			campaignId : campaignId,
			seenAt     : faker.helpers.arrayElement([undefined, faker.date.past()]),
			dismissedAt: faker.helpers.arrayElement([undefined, faker.date.past()]),
			createdAt  : faker.date.past(),
			title      : `Notification ${i} for campaign`,
			message    : `This is a sample notification message number ${i} for campaign ${campaignId}.`,
			type       : faker.helpers.arrayElement(Object.values(notificationTypes))
		});
	}

	return results;
};
