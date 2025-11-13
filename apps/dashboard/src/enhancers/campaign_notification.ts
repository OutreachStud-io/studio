import {z} from "zod";

import {schema} from "@outreachstudio/orpc/schema";


export type TNotification = z.infer<typeof schema.campaignsNotifications.select>;
export type TEnhancedNotification = InstanceType<typeof NotificationEnhancer>;
export const types = schema.campaignsNotifications.select.shape.type.enum;

export class NotificationEnhancer {
	notification: TNotification;

	constructor(notification: TNotification) {
		this.notification = notification;
	}

	get isWarning(): boolean {
		return this.notification.type === types.warning;
	}

	get isInfo(): boolean {
		return this.notification.type === types.info;
	}

	get isError(): boolean {
		return this.notification.type === types.error;
	}

	get isDismissed(): boolean {
		return this.notification.dismissedAt !== undefined && this.notification.dismissedAt !== null;
	}
}
