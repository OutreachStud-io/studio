import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller, Session, Param} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {schema} from "@outreachstudio/orpc/schema";
import {contract} from '@outreachstudio/orpc/contract';

import {paginatedResponse} from "@/lib/util";

import {genData as genListsData} from "@/modules/leads/lists/controller";
import {genCampaign} from "@/modules/campaigns/controller";

@Controller()
export class CampaignsLeadsListsController {

	@Implement(contract.campaignsLeadsLists.list)
	list() {
		return implement(contract.campaignsLeadsLists.list)
			.handler(({input}) => {
				return paginatedResponse(
					generateData(5), {
						limit : input.paginate?.limit || 10,
						cursor: 0,
						total : 100,
					}
				);
			});
	}

	@Implement(contract.campaignsLeadsLists.create)
	create(@Session() session: Record<string, any>) {
		return implement(contract.campaignsLeadsLists.create)
			.handler(({input}) => {
				const result = generateData(1)[0];
				if (!result) {
					throw new Error('Failed to create lead label');
				}
				return result;
			});
	}

	@Implement(contract.campaignsLeadsLists.remove)
	remove(@Param('id') id: string, @Param('campaignId') campaignId: string) {
		return implement(contract.campaignsLeadsLists.remove)
			.handler(({input}) => {
				console.log(id);
			});
	}
}

const generateData = (n: number) => {
	const results: z.infer<typeof schema.campaignsLeadsLists.list> = [];
	const lists = genListsData(n);
	const campaign = genCampaign();

	for (let i = 0; i < n; i++) {
		const list = lists[i];

		const campaignsCount = Math.floor(Math.random() * 3);
		const selected = faker.helpers.maybe(() => true) ?? false;

		results.push({
			id        : faker.string.uuid(),
			createdAt : faker.date.past(),
			listId    : list!.id,
			campaignId: campaign.id,
			selected  : faker.helpers.maybe(() => true) ?? false,
			counts    : {
				leads    : Math.floor(Math.random() * 100000),
				campaigns: campaignsCount + (selected ? 1 : 0),
			},
			campaign, list
		});
	}

	return results;
};
