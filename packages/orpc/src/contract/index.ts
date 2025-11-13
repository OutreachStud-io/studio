import {oc} from '@orpc/contract';

import projects, {type TProjects} from "./projects";
import projectsCollaborators, {type TProjectsCollaborators} from "./projects_collaborators";

import leads from "./leads";
import leadsLists from "./leads_lists";
import leadsLabels, {type TLeadsLabels} from "./leads_labels";

import replies from "./replies";

import campaigns, {type TCampaigns} from "./campaigns";

import campaignsLeads from "./campaigns_leads";
import campaignsLeadsLists from "./campaigns_leads_lists";
import campaignsCounters from "./campaigns_counters";
import campaignsNotifications from "./campaigns_notifications";
import campaignsSequences from "./campaigns_sequences";
import campaignsSequencesVersions from "./campaigns_sequences_versions";

// Contracts
export const contract = {
	projects             : oc.prefix("/projects").router(projects),
	projectsCollaborators: oc.prefix("/projects").router(projectsCollaborators),

	leads      : oc.prefix("/leads").router(leads),
	leadsLists : oc.prefix("/leads/lists").router(leadsLists),
	leadsLabels: oc.prefix("/leads/labels").router(leadsLabels),

	replies: oc.prefix("/replies").router(replies),

	campaignsLeads            : oc.prefix("/campaigns").router(campaignsLeads),
	campaignsLeadsLists       : oc.prefix("/campaigns").router(campaignsLeadsLists),
	campaignsCounters         : oc.prefix("/campaigns/counters").router(campaignsCounters),
	campaignsNotifications    : oc.prefix("/campaigns/notifications").router(campaignsNotifications),
	campaignsSequences        : oc.prefix("/campaigns/sequences").router(campaignsSequences),
	campaignsSequencesVersions: oc.prefix("/campaigns/sequences/versions").router(campaignsSequencesVersions),
	campaigns                 : oc.prefix("/campaigns").router(campaigns),
};

export type TContract = {
	Campaigns: TCampaigns;

	Projects: TProjects;
	ProjectsCollborators: TProjectsCollaborators;

	LeadsLabels: TLeadsLabels;
};
