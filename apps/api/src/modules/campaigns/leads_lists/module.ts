import {Module} from '@nestjs/common';

import {CampaignsLeadsListsController} from "@/modules/campaigns/leads_lists/controller";

@Module({
	imports    : [],
	controllers: [CampaignsLeadsListsController],
	providers  : [],
})
export class CampaignsLeadsListsModule {
}
