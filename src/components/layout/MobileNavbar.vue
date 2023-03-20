<script setup lang="ts">
import { store } from "../../utils/store";
import {
	IconSun,
	IconMoon,
	IconHome,
	IconBell,
	IconPencilPlus,
} from "@tabler/icons-vue";
import Button from "../button/Button.vue";
import Link from "../transitions/Link.vue";
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import { IconX } from "@tabler/icons-vue";
import NotificationsFeed from "../feed/NotificationsFeed.vue";
import Conversation from "../feed/Conversation.vue";

const toggleTheme = () => {
	if (store.theme === "dark") {
		store.theme = "light";

		document.getElementsByTagName("html")[0].classList.remove("dark");
	} else if (store.theme === "light") {
		store.theme = "dark";

		document.getElementsByTagName("html")[0].classList.add("dark");
	}
};

const _window = window;

const composeNewPost = () => {
	store.state.composer = true;
};

const openNotifications = () => {
	store.state.notifications = true;
};

const closeNotifications = () => {
	store.state.notifications = false;
};

const closePostViewer = () => {
	store.state.postViewer = false;
};
</script>

<template>
	<header
		:class="[
			'flex fixed inset-x-0 bottom-0 z-[999999] justify-between items-center px-6 py-2 bg-white border-b dark:border-gray-700 dark:bg-dark-800 md:hidden',
			(store.state.postViewer ||
				store.state.notifications ||
				store.state.composer) &&
				'hidden',
		]">
		<Button
			theme="gray"
			class="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent"
			@click="toggleTheme">
			<IconSun v-if="store.theme === 'light'" aria-hidden="true" />
			<IconMoon v-if="store.theme === 'dark'" aria-hidden="true" />
		</Button>
		<RouterLink to="/">
			<Button
				theme="gray"
				class="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent"
				title="Visit main feed">
				<IconHome aria-hidden="true" />
			</Button>
		</RouterLink>
		<Button
			theme="gray"
			title="Compose new post"
			@click="composeNewPost"
			class="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent">
			<IconPencilPlus aria-hidden="true" />
		</Button>
		<Button
			theme="gray"
			title="Open notifications"
			@click="openNotifications"
			class="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent">
			<IconBell aria-hidden="true" />
		</Button>
		<Button
			theme="gray"
			title="Your avatar"
			class="!p-0 !border-none !shadow-none !bg-white dark:!bg-transparent">
			<img
				:src="store.auth.data?.avatar"
				class="w-9 h-9 rounded border-2"
				alt="Your avatar" />
		</Button>
	</header>

	<TransitionRoot
		as="template"
		:show="store.state.notifications && _window.innerWidth < 768">
		<Dialog
			as="div"
			:unmount="false"
			class="flex fixed inset-0 max-w-full pointer-events-none">
			<TransitionChild
				:unmount="false"
				as="template"
				enter="ease-out duration-100"
				enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
				enterTo="opacity-100 translate-y-0 scale-100"
				leave="ease-in duration-100"
				leaveFrom="opacity-100 translate-y-0 scale-100"
				leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95">
				<DialogPanel
					class="overflow-hidden relative w-screen max-w-md pointer-events-auto">
					<div
						class="flex overflow-y-hidden flex-col pt-6 h-full bg-white shadow-xl dark:bg-dark-800">
						<div class="flex justify-between px-4 sm:px-6">
							<DialogTitle
								class="text-lg font-medium text-gray-900 dark:text-gray-50">
								Notifications
							</DialogTitle>
							<button
								type="button"
								@click="closeNotifications"
								class="text-gray-300 rounded-md dark:hover:text-white focus:outline-none">
								<span class="sr-only"> Close panel </span>
								<IconX class="w-6 h-6" aria-hidden="true" />
							</button>
						</div>
						<div
							class="flex overflow-hidden relative px-4 mt-6 max-w-full grow sm:px-6">
							<NotificationsFeed :title="false" />
						</div>
					</div>
				</DialogPanel>
			</TransitionChild>
		</Dialog>
	</TransitionRoot>

	<TransitionRoot
		as="template"
		:show="store.state.postViewer && _window.innerWidth < 768">
		<Dialog
			as="div"
			:unmount="false"
			class="flex fixed inset-0 max-w-full pointer-events-none">
			<TransitionChild
				:unmount="false"
				as="template"
				enter="ease-out duration-100"
				enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
				enterTo="opacity-100 translate-y-0 scale-100"
				leave="ease-in duration-100"
				leaveFrom="opacity-100 translate-y-0 scale-100"
				leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95">
				<DialogPanel
					class="overflow-hidden relative w-screen max-w-md pointer-events-auto">
					<div
						class="flex overflow-y-hidden flex-col pt-6 h-full bg-white shadow-xl dark:bg-dark-800">
						<div class="flex justify-between px-4 sm:px-6">
							<DialogTitle
								class="text-lg font-medium text-gray-900 dark:text-gray-50">
								Conversation
							</DialogTitle>
							<button
								type="button"
								@click="closePostViewer"
								class="text-gray-300 rounded-md dark:hover:text-white focus:outline-none">
								<span class="sr-only"> Close panel </span>
								<IconX class="w-6 h-6" aria-hidden="true" />
							</button>
						</div>
						<div
							class="flex overflow-hidden relative mt-6 max-w-full grow sm:px-6">
							<Conversation
								:title="false"
								:id="store.viewingConversation" />
						</div>
					</div>
				</DialogPanel>
			</TransitionChild>
		</Dialog>
	</TransitionRoot>
</template>
