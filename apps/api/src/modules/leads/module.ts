import {Module} from '@nestjs/common';

import {LeadsLabelsModule} from "@/modules/leads/labels/module";
import {LeadsListsModule} from "@/modules/leads/lists/module";

import {LeadsController} from "./controller";

@Module({
	imports    : [
		LeadsLabelsModule,
		LeadsListsModule
	],
	controllers: [LeadsController],
	providers  : [],
})
export class LeadsModule {
}
