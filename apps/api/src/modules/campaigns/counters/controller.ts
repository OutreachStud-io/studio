import {z} from "zod";

import {Controller} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {schema} from "@outreachstudio/orpc/schema";
import {contract} from '@outreachstudio/orpc/contract';


@Controller()
export class CampaignsCountersController {

	@Implement(contract.campaignsCounters.list)
	list() {

		return implement(contract.campaignsCounters.list)
			.handler(({input}) => {
				return generateNDaysCounters(90);
			});
	}
}


const generateNDaysCounters = (n: number, hours: boolean = false) => {
	const results: z.infer<typeof schema.campaignsCounters.list> = [];

	for (let i = 0; i < n; i++) {
		const date = new Date();

		let formattedDate: string;

		if (hours) {
			date.setHours(date.getHours() - i);
			const isoString = date.toISOString();
			formattedDate = isoString.split("T")[0]!; // Format as YYYY-MM-DD
			formattedDate = formattedDate + " " + isoString.slice(11, 13); // Extract hour (HH)
		} else {
			date.setDate(date.getDate() - i);
			const isoString = date.toISOString();
			formattedDate = isoString.split("T")[0]!; // Format as YYYY-MM-DD
		}

		results.push({
			date        : formattedDate,
			sent        : Math.floor(Math.random() * 1000),
			delivered   : Math.floor(Math.random() * 1000),
			opened      : Math.floor(Math.random() * 500),
			clicked     : Math.floor(Math.random() * 200),
			replied     : Math.floor(Math.random() * 50),
			bounced     : Math.floor(Math.random() * 20),
			unsubscribed: Math.floor(Math.random() * 10),
		});
	}

	return results.sort((a, b) => (a?.date && b?.date && a.date < b.date ? 1 : -1));
};
