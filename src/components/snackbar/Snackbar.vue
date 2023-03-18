<script setup lang="ts">
import { v4 } from 'uuid';
import { store } from '../../utils/store';
import Notification from './Notification.vue';
</script>

<script lang="ts">
export const addNotification = (content: string, icon?: any) => {
	const uuid = v4();
	store.notifications.push({
		uuid: uuid,
		content: content,
		show: true,
		icon: icon ?? undefined
	});
}
</script>

<template>
	<!-- Global notification live region, render this permanently at the end of the document -->
	  <div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[99999999]">
	    <div class="w-full flex flex-col items-center space-y-3 sm:items-start">
	      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
	      <Notification v-for="notif, index of store.notifications.reverse()" :appear="true" :notif="notif">
	      </Notification>
	    </div>
	  </div>
</template>