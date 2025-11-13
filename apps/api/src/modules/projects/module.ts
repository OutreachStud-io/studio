import {Module} from '@nestjs/common';

import {ProjectsController} from "@/modules/projects/controller";
import {ProjectsCollaboratorsModule} from "@/modules/projects/collaborators/module";

@Module({
	imports    : [ProjectsCollaboratorsModule],
	controllers: [ProjectsController],
	providers  : [],
})
export class ProjectsModule {
}
