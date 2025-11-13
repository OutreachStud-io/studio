import {type TEnhancedCampaign} from "@/enhancers/campaign.ts";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import React from "react";

export const StatusBadge = (
	{campaign}: {
		campaign: TEnhancedCampaign;
	}
) => {
	return (
		<Badge
			className={cn(
				"font-mono text-[0.7rem] py-[1px] px-[4px] !rounded-[4px]",
				campaign.isDraft && "bg-campaign-draft",
				campaign.isActive && "bg-campaign-active",
				campaign.isPaused && "bg-campaign-paused",
				campaign.isEnded && "bg-campaign-ended"
			)}
		>{campaign.campaign.status.toUpperCase()}</Badge>
	);
};
