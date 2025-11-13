import {z} from "zod";

import {schema} from "@outreachstudio/orpc/schema";

import type {TGetOutputResult} from "@/tanstack/query/projects/get.ts";


export type TEnhancedCampaign = InstanceType<typeof ProjectEnhancer>;
export const statuses = schema.projects.select.shape.status.enum;

export class ProjectEnhancer {
	project: TGetOutputResult;

	constructor(project: TGetOutputResult) {
		this.project = project;
	}

	get isArchived(): boolean {
		return this.project.status === statuses.archived;
	}

	get isPaused(): boolean {
		return this.project.status === statuses.paused;
	}

	get isActive(): boolean {
		return this.project.status === statuses.active;
	}
}
