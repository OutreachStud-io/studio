import {
	integer,
	pgTable,
	varchar,
	timestamp,
	text,
	boolean,
	pgEnum,
	uuid,
	numeric,
	unique
} from "drizzle-orm/pg-core";

import {relations} from "drizzle-orm";
import {createSelectSchema} from "drizzle-zod";


export const notificationTypes = {
	info   : "info",
	warning: "warning",
	error  : "error",
} as const;

export const leadLabelTypes = {
	neutral : "neutral",
	positive: "positive",
	warning : "warning",
	negative: "negative",
} as const;

export const campaignStatusTypes = {
	draft    : "draft",
	active   : "active",
	paused   : "paused",
	ended    : "ended",// ended by time or something else
	completed: "completed",// completed all sequences and leads
	archived : "archived",
	stopped  : "stopped",// stopped due to high bounce rate or manual stop
} as const;

export const projectStatusTypes = {
	active  : "active",
	paused  : "paused",
	archived: "archived",
} as const;

export const espTypes = {
	microsoft: "microsoft",
	outlook  : "outlook",
	gmail    : "gmail",
	gsuite   : "gsuite",
	zoho     : "zoho",
	zohopro  : "zohopro",
	yahoo    : "yahoo",
	other    : "other",
} as const;

export type ESPType = typeof espTypes[keyof typeof espTypes];

export const leadStatusTypes = {
	contacted   : "contacted",
	completed   : "completed",
	replied     : "replied",
	rescheduled : "rescheduled",
	unsubscribed: "unsubscribed",
	bounced     : "bounced",
	skipped     : "skipped",
} as const;

export type TLeadStatusType = typeof leadStatusTypes[keyof typeof leadStatusTypes];

export const ProjectStatusEnum = pgEnum(
	'project_status_enum',
	Object.values(projectStatusTypes) as unknown as readonly ['active', ...string[]]
);

export const projectsTable = pgTable("projects", {
	id        : uuid('id').defaultRandom().primaryKey(),
	name      : text("name").notNull(),
	icon      : varchar("icon", {length: 50}).default("command").notNull().default("command"),
	createdAt : timestamp("created_at", {mode: "date"}).defaultNow().notNull(),
	archivedAt: timestamp("archived_at", {mode: "date"}),
	pausedAt  : timestamp("paused_at", {mode: "date"}),
	status    : ProjectStatusEnum("status").notNull().default(projectStatusTypes.active),
});

export const projectsTableRelations = relations(
	projectsTable,
	({many, one}) => ({
		results: many(campaignsTable),
	}),
);

export type TSelectProject = typeof projectsTable.$inferSelect;

export const usersTable = pgTable("users", {
	id       : uuid('id').defaultRandom().primaryKey(),
	name     : text("name"),
	email    : text("email").unique(),
	avatar   : text("avatar"),
	createdAt: timestamp("created_at", {mode: "date"}).defaultNow().notNull(),
});

export type TSelectUser = typeof usersTable.$inferSelect;

export const EspTypesEnum = pgEnum(
	'esp_types_enum',
	Object.values(espTypes) as unknown as readonly ['microsoft', ...string[]]
);

// ---------------------------------------------------------------------------------------
export const leadsListsTable = pgTable("leads_lists", {
	id       : uuid('id').defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projectsTable.id, {
			onDelete: "cascade"
		}),
	createdAt: timestamp("created_at", {mode: "date"}),
	name     : varchar({length: 255}).notNull(),
});

export const leadListsTableRelations = relations(
	leadsListsTable,
	({many, one}) => ({
		leads: many(leadsTable),
	}),
);

// ---------------------------------------------------------------------------------------
export const leadsTable = pgTable("leads", {
	id           : uuid('id').defaultRandom().primaryKey(),
	listId       : uuid("list_id")
		.notNull()
		.references(() => leadsListsTable.id, {
			onDelete: "cascade"
		}),
	esp          : EspTypesEnum("esp"),
	email        : varchar("email", {length: 255}).notNull(),
	firstName    : varchar("first_name", {length: 55}).notNull(),
	lastName     : varchar("last_name", {length: 55}).notNull(),
	city         : varchar("city", {length: 100}).notNull(),
	state        : varchar("state", {length: 100}).notNull(),
	country      : varchar("country", {length: 100}).notNull(),
	jobTitle     : varchar("job_title", {length: 100}).notNull(),
	company      : varchar("company", {length: 100}).notNull(),
	phone        : varchar("phone", {length: 20}).notNull(),
	industry     : varchar("industry", {length: 100}).notNull(),
	notes        : text("notes"),
	createdAt    : timestamp("created_at", {mode: "date"}),
	blacklistedAt: timestamp("blacklisted_at", {mode: "date"}),
});

export type TSelectLead = typeof leadsTable.$inferSelect;

// ---------------------------------------------------------------------------------------

export const CampaignStatusEnum = pgEnum(
	'campaign_status_enum',
	Object.values(campaignStatusTypes) as unknown as readonly ['draft', ...string[]]
);

export const campaignsTable = pgTable("campaigns", {
	id         : uuid('id').defaultRandom().primaryKey(),
	projectId  : uuid("project_id")
		.notNull()
		.references(() => projectsTable.id, {
			onDelete: "cascade"
		}),
	name       : varchar({length: 255}).notNull(),
	description: varchar({length: 1000}).notNull(),

	createdAt: timestamp("created_at", {mode: "date"}).notNull(),
	updatedAt: timestamp("updated_at", {mode: "date"}),
	startsAt : timestamp("starts_at", {mode: "date"}),
	endsAt   : timestamp("ends_at", {mode: "date"}),

	status: CampaignStatusEnum("status").notNull().default(campaignStatusTypes.draft),
	tzSend: boolean("tz_send").default(false), // send according to lead timezone

	// the max bounce rate before campaign is stopped
	maxBounceRate: numeric("max_bounce_rate", {precision: 1}),

	stoppedReason: varchar("stopped_explanation", {length: 255}),
});

export type TSelectCampaign = typeof campaignsTable.$inferSelect;

export const campaignsTableRelations = relations(
	campaignsTable,
	({many, one}) => ({
		project      : one(projectsTable, {
			fields    : [campaignsTable.projectId],
			references: [projectsTable.id],
		}),
		notifications: many(campaignNotificationsTable),
		leadLists    : many(campaignleadListsTable),
	}),
);


export const campaignleadListsTable = pgTable("campaign_lead_lists", {
	id        : uuid('id').defaultRandom().primaryKey(),
	listId    : uuid("list_id")
		.notNull()
		.references(() => leadsListsTable.id, {
			onDelete: "cascade"
		}),
	campaignId: uuid("campaign_id")
		.notNull()
		.references(() => campaignsTable.id, {
			onDelete: "cascade"
		}),
	createdAt : timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
});

export const campaignleadListsTableRelations = relations(
	campaignleadListsTable,
	({many, one}) => ({
		list    : one(leadsListsTable, {
			fields    : [campaignleadListsTable.listId],
			references: [leadsListsTable.id],
		}),
		campaign: one(campaignsTable, {
			fields    : [campaignleadListsTable.campaignId],
			references: [campaignsTable.id],
		}),
	}),
);

export const NotificationTypesEnum = pgEnum(
	'notification_types_enum',
	Object.values(notificationTypes) as unknown as readonly ['free', ...string[]]
);

// ---------------------------------------------------------------------------------------
export const campaignNotificationsTable = pgTable("campaign_notifications", {
	id         : uuid('id').defaultRandom().primaryKey(),
	campaignId : uuid("campaign_id")
		.notNull()
		.references(() => campaignsTable.id, {
			onDelete: "cascade"
		}),
	title      : varchar({length: 255}).notNull(),
	message    : varchar({length: 1000}).notNull(),
	type       : NotificationTypesEnum("type"),
	createdAt  : timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
	seenAt     : timestamp("seen_at", {mode: "date"}),
	dismissedAt: timestamp("dismissed_at", {mode: "date"}),
});

export type TSelectCampaignNotification = typeof campaignNotificationsTable.$inferSelect;

export const campaignNotificationsTableRelations = relations(
	campaignNotificationsTable,
	({many, one}) => ({
		campaign: one(campaignsTable, {
			fields    : [campaignNotificationsTable.campaignId],
			references: [campaignsTable.id],
		}),
	}),
);

export const TLeadStatusTypesEnum = pgEnum(
	'lead_status_types_enum',
	Object.values(leadStatusTypes) as unknown as readonly ['contacted', ...string[]]
);

/**
 * -------------------------------------------------------------------------
 * Relation between a campaign and a lead list which holds the list of leads
 * that will be contacted as part of the campaign
 * -------------------------------------------------------------------------
 */
export const campaignLeadListsTable = pgTable("campaign_lead_lists", {
	id        : uuid('id').defaultRandom().primaryKey(),
	listId    : uuid("list_id")
		.notNull()
		.references(() => leadsListsTable.id, {
			onDelete: "cascade"
		}),
	campaignId: uuid("campaign_id")
		.notNull()
		.references(() => campaignsTable.id, {
			onDelete: "cascade"
		}),
});

export const campaignLeadListsTableRelations = relations(
	campaignLeadListsTable,
	({many, one}) => ({
		campaign: one(campaignsTable, {
			fields    : [campaignLeadListsTable.campaignId],
			references: [campaignsTable.id],
		}),
	}),
);

/**
 * Labels assigned to leads within a campaign
 */
export const TLeadLabelTypesEnum = pgEnum(
	'lead_label_types_enum',
	Object.values(leadLabelTypes) as unknown as readonly ['neutral', ...string[]]
);

export const leadsLabelsTable = pgTable("leads_labels", {
	id         : uuid('id').defaultRandom().primaryKey(),
	projectId  : uuid("project_id")
		.references(() => projectsTable.id, {
			onDelete: "cascade"
		}),
	campaignId : uuid("campaign_id")
		.references(() => campaignsTable.id, {
			onDelete: "cascade"
		}),
	name       : varchar({length: 50}).notNull(),
	description: varchar({length: 1000}),
	type       : TLeadLabelTypesEnum("type").default(leadLabelTypes.neutral),

	// prompt to use when asking AI to identify lead with this label
	// this promp will be executed in the context of the whole conversation
	// each time we receive a reply from the lead
	// if no prompt is provided, this label is only applied manually
	// or by other means (triggers)
	aiIdentificationPrompt: text("ai_identification_prompt"),

	// no further contact - will be blacklisted in all campaigns
	triggerBlacklistLead: boolean("trigger_blacklist_lead").default(false),

	// avoid sending to lead for a number of days
	triggerPauseCampaign               : boolean("trigger_pause_campaign").default(false),
	triggerPauseCampaignResumeAfterDays: integer("trigger_pause_campaign_resume_after_days"),

	// move lead to another list
	triggerMoveToOtherList  : boolean("trigger_move_to_other_list").default(false),
	triggerMoveToOtherListId: uuid("trigger_move_to_other_list_list_id")
		.references(() => leadsListsTable.id, {
			onDelete: "set null"
		}),

	// call webhook
	triggerCallWebhook   : boolean("trigger_call_webhook").default(false),
	triggerCallWebhookUrl: varchar("trigger_call_webhook_url"),

	// send notification to sales or marketing team
	triggerNotifyVialEmail     : boolean("trigger_notify_via_email").default(false),
	triggerNotifyViaEmailEmails: text("trigger_notify_via_email_emails"), // array of email addresses

	triggerRemoveLeadFromCampaign: boolean("trigger_remove_lead_from_campaign").default(false),

	triggerApplyLabelAfterPeriod       : boolean("trigger_apply_label_after_period").default(false),
	triggerApplyLabelAfterPeriodDelay  : integer("trigger_apply_label_after_period_delay"),// days
	triggerApplyLabelAfterPeriodLabelId: uuid("trigger_apply_label_after_period_label_id"),

	triggerAutoRemoveLabel     : boolean("trigger_auto_remove_label").default(false),
	triggerAutoRemoveLabelDelay: integer("trigger_auto_remove_label_delay"),
}, (t) => [
	// unique name but only within the same project and/or campaign
	// in other words the same name can be used in different projects or campaigns
	unique('unique_name_to_project_and_or_campaign_idx').on(t.name, t.projectId, t.campaignId),
]);


/**
 * -------------------------------------------------------------------------
 * Relation between a campaign and a lead which holds the status of the lead
 * in the context of the campaign (contacted, replied, etc.) as well as a label
 * that can be used to categorize the lead (interested, not interested, etc.)
 *
 * A lead enters this table only when it has been contacted for the first time
 * so this table holds leads that have been contacted at least once. Counting
 * here will not include leads that have not been contacted yet.
 * -------------------------------------------------------------------------
 */
export const campaignLeadsTable = pgTable("campaign_leads", {
	id        : uuid('id').defaultRandom().primaryKey(),
	leadId    : uuid("lead_id")
		.notNull()
		.references(() => leadsTable.id, {
			onDelete: "cascade"
		}),
	campaignId: uuid("campaign_id")
		.notNull()
		.references(() => campaignsTable.id, {
			onDelete: "cascade"
		}),
	labelId   : uuid("label_id")
		.references(() => leadsLabelsTable.id, {
			onDelete: "set null"
		}),

	status: TLeadStatusTypesEnum("status").default(leadStatusTypes.contacted),
});

export type TSelectCampaignLead = typeof campaignLeadsTable.$inferSelect;
export const campaignLeadSchema = createSelectSchema(campaignLeadsTable);

export const campaignLeadsTableRelations = relations(
	campaignLeadsTable,
	({many, one}) => ({
		campaign: one(campaignsTable, {
			fields    : [campaignLeadsTable.campaignId],
			references: [campaignsTable.id],
		}),
		label   : one(leadsLabelsTable, {
			fields    : [campaignLeadsTable.campaignId],
			references: [leadsLabelsTable.id],
		}),
	}),
);

// ---------------------------------------------------------------------------------------
/**
 * Represents a campaign sequence, which is a series of messages
 * that are being sent in a specific order and at specific time
 * intervals for a campaign.
 */
export const campaignSequencesTable = pgTable("campaign_sequences", {
	id        : uuid('id').defaultRandom().primaryKey(),
	campaignId: uuid("campaign_id")
		.notNull()
		.references(() => campaignsTable.id, {
			onDelete: "cascade"
		}),
	createdAt : timestamp("created_at", {mode: "date"}).defaultNow(),
	// delay in days before the next sequence is sent
	delayDays: integer("delay_days"),
});

export type TSelectCampaignSequence = typeof campaignSequencesTable.$inferSelect;

export const campaignSequencesTableRelations = relations(
	campaignSequencesTable,
	({many, one}) => ({
		campaign: one(campaignsTable, {
			fields    : [campaignSequencesTable.campaignId],
			references: [campaignsTable.id],
		}),
		versions: many(campaignSequenceVersionsTable),
	}),
);

// ---------------------------------------------------------------------------------------
/**
 * Represents a version of a campaign sequence. Useful when the user
 * wants to have an A/B test in order to measure the impact of different
 * contents
 */
export const campaignSequenceVersionsTable = pgTable("campaign_sequence_versions", {
	id            : uuid('id').defaultRandom().primaryKey(),
	sequenceId    : uuid("sequence_id")
		.notNull()
		.references(() => campaignSequencesTable.id, {
			onDelete: "cascade"
		}),
	contentSubject: varchar("content_subject", {length: 255}).notNull(),
	contentBody   : text("content_body").notNull(),
	createdAt     : timestamp("created_at", {mode: "date"}).defaultNow(),
});

export type TSelectCampaignSequenceVersion = typeof campaignSequenceVersionsTable.$inferSelect;


export const campaignSequenceVersionsTableRelations = relations(
	campaignSequencesTable,
	({many, one}) => ({
		sequence: one(campaignSequencesTable, {
			fields    : [campaignSequencesTable.campaignId],
			references: [campaignSequencesTable.id],
		}),
	}),
);
