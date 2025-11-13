import {Module} from '@nestjs/common';

import {CampaignsController} from "@/modules/campaigns/controller";
import {CampaignsSequencesModule} from "@/modules/campaigns/sequences/module";
import {CampaignsNotificationsModule} from "@/modules/campaigns/notifications/module";
import {CampaignsCountersModule} from "@/modules/campaigns/counters/module";
import {CampaignsLeadsModule} from "@/modules/campaigns/leads/module";
import {CampaignsLeadsListsModule} from "@/modules/campaigns/leads_lists/module";

@Module({
	imports    : [
		CampaignsLeadsModule,
		CampaignsCountersModule,
		CampaignsSequencesModule,
		CampaignsNotificationsModule,
		CampaignsLeadsListsModule,
	],
	controllers: [
		CampaignsController,
	],
	providers  : [],
})
export class CampaignsModule {
}
