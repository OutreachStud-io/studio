export const urls = {
	campaigns: {
		list    : "/dashboard/campaigns",
		create  : "/dashboard/campaigns/create",
		show    : (id: string) => `/dashboard/campaigns/${id}`,
		settings: (id: string) => `/dashboard/campaigns/${id}/settings`,
	},
};
