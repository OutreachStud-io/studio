// import {TSequence} from "#components/campaigns/campaign/sequences/sequence";
// import {TCampaign} from "#components/campaigns/list/list";
// import {TChartDimension} from "#components/campaigns/stats";
// import {TCampaignLead} from "#components/leads/list/columns";
// import {TLocation} from "#components/world-map/table";
// import {countryListAllIsoData, randomNumber} from "#lib/utils";
// import {faker} from "@faker-js/faker";
//
//
// export const generateChartData = (length: number): TChartDimension[] => {
// 	const data: TChartDimension[] = [
// 		{
// 			label  : "Emails sent",
// 			entries: [],
// 		},
// 		{
// 			label  : "Opens",
// 			entries: [],
// 		},
// 		{
// 			label  : "Replies",
// 			entries: [],
// 		}
// 	];
// 	const today = new Date();
//
// 	for (let i = 0; i < length; i++) {
// 		const date = new Date(today);
// 		date.setDate(date.getDate() - i);
//
// 		const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
// 		const randomCount = (min: number = 1, max: number = 100) => Math.floor(Math.random() * max) + min; // Random count between min and max
//
// 		data.forEach((dimension, k) => {
// 			dimension.entries.push({
// 				date : formattedDate,
// 				count: randomCount(1, 100 - (k * 45)),
// 			});
// 		});
// 	}
// 	return data;
// };
//
// export const generateRepliesLocations = (length: number): TLocation[] => {
// 	const locations: TLocation[] = [];
// 	const randomCount = (min: number = 1, max: number = 100) => Math.floor(Math.random() * max) + min;
//
// 	for (let i = 0; i < length; i++) {
// 		locations.push({
// 			country: countryListAllIsoData[Math.floor(Math.random() * countryListAllIsoData.length)],
// 			amount : randomCount(1, 100),
// 		});
// 	}
// 	return locations;
// };
//
// export const generateCampaignNotifications = (length: number): TSelectCampaignNotification[] => {
// 	const notifications: TSelectCampaignNotification[] = [];
// 	for (let i = 0; i < length; i++) {
// 		notifications.push({
// 			id        : `${i}`,
// 			title     : faker.lorem.sentence({min: 3, max: 5}),
// 			message   : faker.lorem.sentence({min: 10, max: 20}),
// 			createdAt : new Date(new Date().setDate(new Date().getDate() - randomNumber(1, 30))),
// 			campaignId: `${Math.floor(Math.random() * 100)}`, // Random campaign ID
// 			seenAt    : Math.random() < 0.5 ? new Date(new Date().setDate(new Date().getDate() - randomNumber(1,
// 				30))) : null,
// 			type      : ["info", "warning", "error"][Math.floor(Math.random() * 3)] as "info" | "warning" | "error",
// 			code      : faker.string.alphanumeric(10), // Random code
// 		});
// 	}
//
// 	return notifications;
// };
//
// export const generateCampaignSequences = (length: number): TSequence[] => {
// 	const sequences: TSequence[] = [];
// 	for (let i = 0; i < length; i++) {
// 		const versions: TSelectCampaignSequenceVersion[] = [];
// 		const versionsCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 versions
//
// 		for (let j = 0; j < versionsCount; j++) {
// 			versions.push({
// 				id            : j + 1,
// 				contentSubject: faker.lorem.sentence({min: 3, max: 6}),
// 				contentBody   : faker.lorem.paragraphs(faker.number.int({min: 1, max: 3}), "<br/>"),
// 				createdAt     : new Date(new Date().setDate(new Date().getDate() - randomNumber(1, 30))),
// 				sequenceId    : i + 1,
// 				campaignId    : 1,
// 				delayDays     : 1,
// 			} as TSelectCampaignSequenceVersion);
// 		}
//
// 		sequences.push({
// 			sequence      : {
// 				id        : i + 1,
// 				campaignId: 1,
// 				delayDays : i * 2,
// 				createdAt : new Date(new Date().setDate(new Date().getDate() - randomNumber(1, 30))),
// 			},
// 			versions      : versions,
// 			sequenceNumber: i + 1,
// 		});
// 	}
// 	return sequences;
// };
//
// export const generateCampaignLeads = (length: number): TCampaignLead[] => {
// 	const leadLabels = Object.values(leadLabelTypes);
// 	const leadStatuses = Object.values(leadStatusTypes);
//
//
// 	const leads: TCampaignLead[] = [];
// 	for (let i = 0; i < length; i++) {
// 		const leadId = i + 1;
//
// 		const sequencesTotal = 4;
// 		const sequencesCount = Math.floor(Math.random() * (sequencesTotal + 1));
//
// 		let status: TLeadStatusType = leadStatuses.filter(
// 			(s) => s !== "not_contacted"
// 		)[Math.floor(Math.random() * leadStatuses.length)];
//
// 		if (sequencesCount == sequencesTotal) {
// 			status = "completed";
// 		}
//
// 		if (sequencesCount === 0) {
// 			status = "not_contacted";
// 		}
//
// 		const label = leadLabels[Math.floor(Math.random() * leadLabels.length)];
//
// 		leads.push({
// 			lead        : {
// 				id       : leadId,
// 				listId   : 1,
// 				esp      : faker.helpers.arrayElement(Object.values(espTypes)),
// 				email    : faker.internet.email(),
// 				firstName: faker.person.firstName(),
// 				lastName : faker.person.lastName(),
// 				city     : faker.location.city(),
// 				state    : faker.location.state(),
// 				country  : faker.location.country(),
// 				jobTitle : faker.person.jobTitle(),
// 				company  : faker.company.name(),
// 				phone    : faker.phone.number(),
// 				industry : faker.commerce.department(),
// 				notes    : faker.lorem.paragraph(),
// 				createdAt: new Date(),
// 			},
// 			campaignLead: {
// 				id        : 1,
// 				leadId    : leadId,
// 				campaignId: 1, // Random campaign ID
// 				opened    : Math.random() < 0.5, // Randomly assign opened status
// 				replied   : Math.random() < 0.5, // Randomly assign replied status
// 				status    : status,
// 				label     : label,
// 			},
//
// 			sequencesCount: sequencesCount,
// 			sequencesTotal: sequencesTotal,
// 		});
// 	}
// 	return leads;
// };
//
// export const generateRandomCampaigns = (length: number): TCampaign[] => {
// 	const campaigns: TCampaign[] = [];
// 	const randomCount = (min: number = 1, max: number = 100) => Math.floor(Math.random() * max) + min;
//
// 	for (let i = 0; i < length; i++) {
// 		const status = ["draft", "active", "ended", "paused"][Math.floor(Math.random() * 4)] as "draft" | "active" | "ended" | "paused";
//
// 		campaigns.push({
// 			id             : `${i}`,
// 			name           : faker.commerce.product() + ` campaign ` + faker.commerce.productAdjective().toLowerCase(),
// 			description    : faker.lorem.sentence({min: 10, max: 15}),
// 			leads          : randomCount(10034, 50000),
// 			sent           : randomCount(100, 50000),
// 			replies        : randomCount(10, 100),
// 			opens          : randomCount(100, 1500),
// 			createdAt      : new Date(),
// 			updatedAt      : new Date(),
// 			endsAt         : status === "ended" ? new Date(new Date().setDate(new Date().getDate() - randomNumber(1,
// 				30))) : undefined,
// 			status         : status,
// 			warpSending    : Math.random() < 0.5, // Randomly assign warp sending
// 			bounceRate     : Math.random() < 0.5 ? randomNumber(1, 2) / 100 : undefined, // Random bounce rate between 1% and 10%
// 			minBounceRate  : Math.random() < 0.5 ? randomNumber(1, 2) / 100 : undefined, // Random minimum bounce rate between 1% and 10%
// 			scheduleEntries: [
// 				{
// 					startHour  : 0,
// 					startMinute: 1,
// 					endHour    : randomNumber(0, 12),
// 					endMinute  : 1,
// 					daysOfWeek : Array.from({length: 5}, (_, index) => index), // Weekdays only
// 					timezone   : "America/New_York", // Fixed timezone for simplicity
// 				},
// 				{
// 					startHour  : 0,
// 					startMinute: 1,
// 					endHour    : randomNumber(0, 12),
// 					endMinute  : 1,
// 					daysOfWeek : [6, 7], // Weekends only
// 					timezone   : "America/New_York", // Fixed timezone for simplicity
// 				},
// 			],
// 		});
// 	}
// 	return campaigns;
// };
