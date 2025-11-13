import {NotificationEnhancer} from "@/enhancers/campaign_notification.ts";
import {queryOptions, useQuery} from '@tanstack/react-query';

import {tanstackClient} from "@/orpc/client.ts";
import {type QueryConfig} from "@/tanstack/query/config.ts";

type TInputParams = Parameters<typeof tanstackClient.campaignsNotifications.list.call>[0];


export const getQueryOptions = (p: TInputParams) => {
	return queryOptions({
		queryKey: ['campaigns', 'notifications', 'list', p],
		queryFn : () => tanstackClient.campaignsNotifications.list.call(p),
		select: (data) => ({
			...data,
			data: data.data.map(
				(notification) => new NotificationEnhancer(notification)),
		})
	});
};

type UseOptions = {
	input: TInputParams;
	queryConfig?: QueryConfig<typeof getQueryOptions>;
};

export const useCampaignNotificationsQuery = (
	params: UseOptions
) => {
	return useQuery({
		...getQueryOptions(params.input),
		...params.queryConfig,
	});
};
