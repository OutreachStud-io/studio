import {Module} from '@nestjs/common';

import {RepliesController} from "@/modules/replies/controller";

@Module({
	imports    : [],
	controllers: [RepliesController],
	providers  : [],
})
export class RepliesModule {
}
