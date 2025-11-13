import {z} from 'zod';

import {createSelectSchema, createInsertSchema, createUpdateSchema} from "drizzle-zod";

import {usersTable} from "@outreachstudio/dbschema";

export const dbSelectSchema = createSelectSchema(usersTable);
export const dbInsertSchema = createInsertSchema(usersTable);
export const dbUpdateSchema = createUpdateSchema(usersTable);

export const selectSchema = dbSelectSchema.extend({
	createdAt: z.coerce.date(),
});
export const listSchema = z.array(selectSchema);


const validationSchema = {
	name: z.string()
		.min(1, 'Name is too short')
		.max(50, 'Name must be at most 50 characters long'),
};

const schemaFactory = {
	insert: () => dbInsertSchema.extend(validationSchema).omit({id: true}),
	update: () => dbUpdateSchema.extend({
		...validationSchema,
		name: validationSchema.name.optional(),
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
