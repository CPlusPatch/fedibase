<script setup lang="ts">
import { v4 } from 'uuid';
import Notification from './Notification.vue';
import { ref } from 'vue';
</script>

<script lang="ts">
export enum NotificationType {
	Normal,
	NewMention,
	Error
}

const notifications = ref<{
	uuid: string,
	type: NotificationType,
	content: any,
	show: boolean,
	icon: any,
}[]>([]);

export const addNotification = (content: any, type?: NotificationType, icon?: any) => {
	console.log(content);
	const uuid = v4();
	notifications.value.push({
		type: type ?? NotificationType.Normal,
		uuid: uuid,
		content: content,
		show: true,
		icon: icon ?? undefined
	});

	setTimeout(() => {
		let notif = notifications.value.find(n => n.uuid === uuid);
		if (notif) notif.show = false;
		setTimeout(() => {
			notifications.value = notifications.value.filter(n => n.uuid !== uuid);
		}, 500);
	}, 4000);
}
</script>

<template>
	<!-- Global notification live region, render this permanently at the end of the document -->
	  <div aria-live="assertive" class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start z-[99999999]">
	    <div class="w-full flex flex-col items-center space-y-3 sm:items-start">
	      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
	      <Notification v-for="notif of notifications" :appear="true" :key="notif.uuid" :notif="notif">
	      </Notification>
	    </div>
	  </div>
</template>