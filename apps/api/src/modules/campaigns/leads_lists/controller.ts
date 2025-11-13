// import {z} from "zod";
//
// import {faker} from "@faker-js/faker";
//
// import {Controller} from '@nestjs/common';
// import {Implement, implement} from '@orpc/nest';
//
// import {schema} from "@outreachstudio/orpc/schema";
// import {contract} from '@outreachstudio/orpc/contract';
//
// import {paginatedResponse} from "@/lib/util";
//
// import {genData as genListsData} from "@/modules/leads/lists/controller";
// import {genCampaign} from "@/modules/campaigns/controller";
//
// @Controller()
// export class CampaignsLeadsListsController {
//
// 	@Implement(contract.campaignsLeadsLists.list)
// 	list() {
// 		return implement(contract.campaignsLeadsLists.list)
// 			.handler(({input}) => {
// 				return paginatedResponse(
// 					generateData(input.paginate?.limit || 20), {
// 						limit : input.paginate?.limit || 10,
// 						cursor: 0,
// 						total : 100,
// 					}
// 				);
// 			});
// 	}
// }
//
// const generateData = (n: number) => {
// 	const results: z.infer<typeof schema.campaignsLeadsLists.list> = [];
// 	const lists = genListsData(n);
// 	const campaign = genCampaign();
//
// 	for (let i = 0; i < n; i++) {
// 		const list = lists[i];
//
// 		results.push({
// 			id        : faker.string.uuid(),
// 			createdAt : faker.date.past(),
// 			listId    : list!.id,
// 			campaignId: campaign.id,
// 			campaign, list
// 		});
// 	}
//
// 	return results;
// };
