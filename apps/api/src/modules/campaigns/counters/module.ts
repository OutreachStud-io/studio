import {Module} from '@nestjs/common';

import {CampaignsCountersController} from "@/modules/campaigns/counters/controller";

@Module({
	imports    : [],
	controllers: [CampaignsCountersController],
	providers  : [],
})
export class CampaignsCountersModule {
}
