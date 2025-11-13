import {z} from 'zod';

export const selectSchema = z.object({
	date        : z.string().min(10).max(30),
	sent        : z.number().min(0),
	delivered   : z.number().min(0),
	opened      : z.number().min(0),
	clicked     : z.number().min(0),
	replied     : z.number().min(0),
	bounced     : z.number().min(0),
	unsubscribed: z.number().min(0)
});

// Contract schema
export const listSchema = z.array(selectSchema);

// Export the schemas
export default {
	select: selectSchema,
	list  : listSchema,
};
