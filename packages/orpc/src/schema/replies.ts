import {z} from 'zod';

// @TODO: needs db schema behind it
export const selectSchema = z.object({
	id        : z.uuid(),
	sequenceId: z.uuid(),
	date      : z.date(),
	subject   : z.string(),
	message   : z.string(),
	ipAddress : z.string().min(7).max(45).optional(),
});

export const locationSchema = z.object({
	city   : z.string().min(1).max(100).optional(),
	state  : z.string().min(1).max(100).optional(),
	country: z.string().min(2).max(2),
	count  : z.number().min(0)
});

export const listSchema = z.array(selectSchema);
export const listLocationsSchema = z.array(locationSchema);

export default {
	select       : selectSchema,
	list         : listSchema,
	listLocations: listLocationsSchema,
};
