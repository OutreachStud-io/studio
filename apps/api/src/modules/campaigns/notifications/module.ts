import {Module} from '@nestjs/common';

import {CampaignsNotificationsController} from "@/modules/campaigns/notifications/controller";

@Module({
	imports    : [],
	controllers: [CampaignsNotificationsController],
	providers  : [],
})
export class CampaignsNotificationsModule {
}
