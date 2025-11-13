import {Module} from '@nestjs/common';

import {LeadsLabelsController} from "./controller";

@Module({
	imports    : [],
	controllers: [LeadsLabelsController],
	providers  : [],
})
export class LeadsLabelsModule {
}
