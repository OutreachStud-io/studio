import {Module} from '@nestjs/common';


import {LeadsListsController} from "./controller";

@Module({
	imports    : [],
	controllers: [LeadsListsController],
	providers  : [],
})
export class LeadsListsModule {
}
