<script setup lang="ts">
import { useStore } from "../../utils/store";

const store = useStore();

defineProps<{
	disableComposer?: boolean;
}>();

const router = useRouter();

const buttons = [
	{
		name: "Settings",
		icon: "ic:round-settings",
		onClick: () => router.push("/settings/account"),
	},
	{
		name: "Home",
		icon: "ic:round-home",
		onClick: () => router.push("/"),
	},
	{
		name: "Notifications",
		icon: "ic:round-notifications",
		onClick: () => router.push("/notifications"),
	},
	{
		name: "Profile",
		icon: "ic:round-account-circle",
		onClick: () => router.push(`/user/${store.auth.data?.id}`),
	},
];
</script>

<template>
	<button
		v-if="!disableComposer"
		class="z-40 border-none fixed md:hidden bottom-20 right-5 flex items-center justify-center p-4 rounded-2xl shadow-lg font-medium bg-orange-100 dark:bg-orange-700 dark:text-orange-100"
		@click="store.state.composer = true">
		<Icon name="ic:twotone-edit" class="w-7 h-7" />
	</button>
	<header
		:class="[
			'z-40 fixed inset-x-0 -bottom-1 border-t border-gray-300 dark:border-dark-600 p-0 overflow-hidden rounded-t items-center justify-around grid grid-cols-4 h-18 bg-white dark:bg-dark-800 md:hidden',
		]">
		<button
			v-for="button of buttons"
			:key="button.name"
			v-ripple
			class="dark:text-orange-50 h-full w-full h-full justify-center border-none text-black flex flex-col items-center gap-y-1"
			@click="button.onClick">
			<Icon :name="button.icon" class="h-6 w-6" aria-hidden="true" />
			<span class="text-xs font-bold font-sans">{{ button.name }}</span>
		</button>
	</header>
</template>
