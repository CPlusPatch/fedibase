<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';
import { store } from '../../utils/store';
import { FunctionalComponent, Transition, TransitionProps, onMounted, onUnmounted, ref } from 'vue';
import { TransitionRoot } from '@headlessui/vue';

const props = defineProps<{
	notif: any,
}>();

const show = ref<boolean>(true);

const timeout = setTimeout(() => {
	show.value = false;
	
	setTimeout(() => {
		store.notifications = store.notifications.filter(n => n.uuid !== props.notif.uuid);
	}, 200);
}, 5000);

const playSound = () => {
	const audio = new Audio("/sounds/waon.mp3");
	audio.play();
}

onUnmounted(() => {
	clearTimeout(timeout);
})

</script>

<template>
	<TransitionRoot as="template" :appear="true"
		:show="show"
		@before-enter="playSound"
		enter="transform ease-out duration-300 transition"
		enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:-translate-x-2"
		enter-to="translate-y-0 opacity-100 sm:translate-x-0" leave="transition ease-in duration-100"
		leave-from="opacity-100 sm:translate-x-0" leave-to="opacity-0 sm:-translate-x-2">
		<div
			class="max-w-sm bg-white/875 backdrop-blur-lg dark:bg-dark-700/75 shadow-lg rounded border dark:border-gray-700 overflow-hidden">
			<div class="px-3 py-2">
				<div class="flex items-center gap-x-3 flex-row">
					<component :is="notif.icon" aria-hidden="true" class="w-4 h-4 text-gray-700 dark:text-gray-300" />
					<p class="text-base font-medium text-gray-900 dark:text-gray-100 mt-0.5">{{ notif.content }}</p>
				</div>
			</div>
		</div>
	</TransitionRoot>
</template>