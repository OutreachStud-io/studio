import {Module} from '@nestjs/common';


import {ProjectsCollaboratorsController} from "./controller";

@Module({
	imports    : [],
	controllers: [ProjectsCollaboratorsController],
	providers  : [],
})
export class ProjectsCollaboratorsModule {
}
