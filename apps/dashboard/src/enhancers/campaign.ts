import {z} from "zod";

import {schema} from "@outreachstudio/orpc/schema";


export type TCampaign = z.infer<typeof schema.campaigns.select>;
export type TEnhancedCampaign = InstanceType<typeof Campaign>;
export const statuses = schema.campaigns.select.shape.status.enum;

export class Campaign {
	campaign: TCampaign;

	constructor(campaign: TCampaign) {
		this.campaign = campaign;
	}

	// statuses
	get isActive(): boolean {
		return this.campaign.status === statuses.active;
	}

	get isStopped(): boolean {
		return this.campaign.status === statuses.draft;
	}

	get isPaused(): boolean {
		return this.campaign.status === statuses.paused;
	}

	get isEnded(): boolean {
		return this.campaign.status === statuses.ended;
	}

	get isDraft(): boolean {
		return this.campaign.status === statuses.draft;
	}

	// rates
	get openRate(): number {
		if (this.campaign.counters.delivered === 0) return 0;
		return Number((this.campaign.counters.opened / this.campaign.counters.delivered) * 100);
	}

	get clickRate(): number {
		if (this.campaign.counters.delivered === 0) return 0;
		return Number((this.campaign.counters.clicked / this.campaign.counters.delivered) * 100);
	}

	get bounceRate(): number {
		if (this.campaign.counters.delivered === 0) return 0;
		return Number((this.campaign.counters.bounced / this.campaign.counters.delivered) * 100);
	}

	get replyRate(): number {
		if (this.campaign.counters.delivered === 0) return 0;
		return Number((this.campaign.counters.replied / this.campaign.counters.delivered) * 100);
	}

	// misc
	get lastUpdated(): Date {
		return this.campaign.updatedAt || this.campaign.createdAt;
	}

	// derrived
	get remainingRunTime(): number {
		if (!this.campaign.endsAt) return Infinity;
		const now = new Date();
		const endsAt = new Date(this.campaign.endsAt);
		const diff = endsAt.getTime() - now.getTime();
		return diff > 0 ? diff : 0;
	}
}
