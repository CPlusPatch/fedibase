<script setup lang="ts">
import { v4 } from "uuid";
import { ref } from "vue";
import Notification from "./Notification.vue";
</script>

<script lang="ts">
export enum NotificationType {
	Normal,
	NewMention,
	Error,
}

const notifications = ref<
	{
		uuid: string;
		type: NotificationType;
		content: any;
		show: boolean;
		icon: any;
	}[]
>([]);

export const addNotification = (
	content: any,
	type?: NotificationType,
	icon?: string
) => {
	const uuid = v4();
	notifications.value.push({
		type: type ?? NotificationType.Normal,
		uuid,
		content,
		show: true,
		icon: icon ?? undefined,
	});

	setTimeout(() => {
		const notif = notifications.value.find(n => n.uuid === uuid);
		if (notif) notif.show = false;
		setTimeout(() => {
			notifications.value = notifications.value.filter(
				n => n.uuid !== uuid
			);
		}, 500);
	}, 4000);
};
</script>

<template>
	<!-- Global notification live region, render this permanently at the end of the document -->
	<div
		aria-live="assertive"
		class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start z-[99999999]">
		<div class="w-full flex flex-col items-center space-y-3 sm:items-start">
			<Notification
				v-for="notif of notifications"
				:key="notif.uuid"
				:appear="true"
				:notif="notif">
			</Notification>
		</div>
	</div>
</template>
