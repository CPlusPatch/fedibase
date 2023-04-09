<script setup lang="ts">
import { TransitionRoot } from "@headlessui/vue";
import { NotificationType } from "./Snackbar.vue";
import { Entity } from "megalodon";
import { withEmojis } from "../../utils/functions";

const props = defineProps<{
	notif: {
		uuid: string;
		type: NotificationType;
		content: any;
		show: boolean;
		icon: any;
	};
}>();

const playSound = () => {
	const audio = new Audio("/sounds/waon.mp3");
	audio.play();
};
</script>

<template>
	<TransitionRoot
		as="template"
		:appear="true"
		:show="notif.show"
		@before-enter="playSound"
		enter="transform ease-out duration-300 transition"
		enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:-translate-x-2"
		enter-to="translate-y-0 opacity-100 sm:translate-x-0"
		leave="transition ease-in duration-100"
		leave-from="opacity-100 sm:translate-x-0"
		leave-to="opacity-0 sm:-translate-x-2">
		<div>
			<div
				v-if="notif.type === NotificationType.Normal"
				class="max-w-sm bg-white/875 backdrop-blur-lg dark:bg-dark-700/75 shadow-lg rounded border dark:border-gray-700 overflow-hidden">
				<div class="px-3 py-2">
					<div class="flex items-center gap-x-3 flex-row">
						<component
							:is="notif.icon"
							aria-hidden="true"
							class="w-4 h-4 text-gray-700 dark:text-gray-300" />
						<p
							class="text-base font-medium text-gray-900 dark:text-gray-100 mt-0.5">
							{{ notif.content }}
						</p>
					</div>
				</div>
			</div>
			<div
				v-if="notif.type === NotificationType.NewMention && (notif.content as Entity.Notification).type ==='mention'"
				class="w-80 max-w-[95%] bg-white/75 backdrop-blur-lg dark:bg-dark-700/75 shadow-lg rounded-lg pointer-events-auto flex">
				<div class="flex-1 p-4">
					<div class="flex items-start">
						<div class="flex-shrink-0 pt-0.5">
							<img
								class="h-10 w-10 rounded-md"
								:src="(notif.content as Entity.Notification).account.avatar"
								alt="" />
						</div>
						<div class="ml-3 w-0 flex-1">
							<p
								class="text-sm font-medium text-gray-900 dark:text-gray-50"
								v-html="withEmojis((notif.content as Entity.Notification).account.display_name ?? '', (notif.content as Entity.Notification).account.emojis ?? [])"></p>
							<p
								class="mt-1 text-sm text-gray-500 status-text line-clamp-3 text-ellipsis break-all"
								v-html="withEmojis((notif.content as Entity.Notification).status?.content?? '', (notif.content as Entity.Notification).status?.emojis ?? [])"></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</TransitionRoot>
</template>
