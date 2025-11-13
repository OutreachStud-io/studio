import {Module} from '@nestjs/common';

import {CampaignsSequencesVersionsController} from "@/modules/campaigns/sequences/versions/controller";

@Module({
	imports    : [],
	controllers: [CampaignsSequencesVersionsController],
	providers  : [],
})
export class CampaignsSequencesVersionsModule {
}
