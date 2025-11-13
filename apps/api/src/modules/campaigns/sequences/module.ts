import {Module} from '@nestjs/common';

import {CampaignsSequencesController} from "@/modules/campaigns/sequences/controller";
import {CampaignsSequencesVersionsModule} from "@/modules/campaigns/sequences/versions/module";

@Module({
	imports    : [CampaignsSequencesVersionsModule],
	controllers: [CampaignsSequencesController],
	providers  : [],
})
export class CampaignsSequencesModule {
}
