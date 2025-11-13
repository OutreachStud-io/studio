import {z} from 'zod';

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {projectsTable} from "@outreachstudio/dbschema";

import usersSchema from "./users";

export const dbSelectSchema = createSelectSchema(projectsTable);
export const dbInsertSchema = createInsertSchema(projectsTable);
export const dbUpdateSchema = createUpdateSchema(projectsTable);

export const selectSchema = dbSelectSchema.extend({
	createdAt : z.coerce.date(),
	pausedAt  : z.coerce.date().optional(),
	archivedAt: z.coerce.date().optional(),

	// expandable fields that we do not include by default due to their costlyness
	collaborators: z.object({
		list : z.array(usersSchema.select.pick({
			id    : true,
			name  : true,
			email : true,
			avatar: true,
		})),
		count: z.number(),
	}).optional(),

	// lifetime stats for the project
	stats: z.object({
		sent   : z.number(),
		bounced: z.number(),
		opened : z.number(),
		replied: z.number(),
	}).optional(),

	counters: z.object({
		campaigns : z.number(),
		leads     : z.number(),
		leadsLists: z.number(),
	}).optional(),
});

export const listSchema = z.array(selectSchema);


const validationSchema = {
	icon: z.string()
		.min(2, 'Icon is too short')
		.max(50, 'Icon must be at most 50 characters long'),
	name: z.string()
		.min(1, 'Name is too short')
		.max(50, 'Name must be at most 50 characters long'),
};

const schemaFactory = {
	insert: () => dbInsertSchema.extend(validationSchema).omit({id: true}),
	update: () => dbUpdateSchema.extend({
		...validationSchema,

		// optionals as we want to allow partial updates
		name: validationSchema.name.optional(),
		icon: validationSchema.name.optional(),
	}),
};

export const insertSchema = schemaFactory.insert();
export const updateSchema = schemaFactory.update();

export default {
	select: selectSchema,
	list  : listSchema,
	insert: insertSchema,
	update: updateSchema
};
