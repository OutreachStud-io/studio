import {Controller} from '@nestjs/common';
import {Implement, implement} from '@orpc/nest';

import {contract} from '@outreachstudio/orpc/contract';

@Controller()
export class CampaignsSequencesController {

	@Implement(contract.campaignsSequences.list)
	list() {
		return implement(contract.campaignsSequences.list)
			.handler(({input}) => {
				return [];
			});
	}
}
