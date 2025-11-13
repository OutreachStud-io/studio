import {z} from "zod";

import {faker} from "@faker-js/faker";

import {Controller} from '@nestjs/common';

import {Implement, implement} from '@orpc/nest';

import {schema} from '@outreachstudio/orpc/schema';
import {contract} from '@outreachstudio/orpc/contract';


export const RoutePrefix = 'replies';

@Controller(RoutePrefix)
export class RepliesController {

	@Implement(contract.replies.listLocations)
	listLocations() {
		return implement(contract.replies.listLocations)
			.handler(({input}) => {
				return generateNDaysResults(20);
			});
	}

}

const generateNDaysResults = (n: number) => {
	const results: z.infer<typeof schema.replies.listLocations> = [];

	for (let i = 0; i < n; i++) {
		results.push({
			city   : faker.location.city(),
			state  : faker.location.state(),
			country: faker.location.countryCode("alpha-2"),
			count  : Math.floor(Math.random() * 100),
		});
	}

	// return results without country code duplicates
	return results.filter((value, index, self) =>
			index === self.findIndex((t) => (
				t.country === value.country
			))
	);
};
