import {Module} from '@nestjs/common';

import {CampaignsLeadsController} from "@/modules/campaigns/leads/controller";

@Module({
	imports    : [],
	controllers: [CampaignsLeadsController],
	providers  : [],
})
export class CampaignsLeadsModule {
}
