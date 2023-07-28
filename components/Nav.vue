<script lang="ts" setup>
import NavElement, { NavigationItem } from "./NavElement.vue";
import { useStore } from "~/utils/store";

const navigation: NavigationItem[] = [
	{
		name: "Home",
		icon: "ic:twotone-home",
		href: "/",
		type: "",
	},
	{
		name: "Instance",
		icon: "ic:twotone-people",
		href: "/local",
		type: "local",
	},
	{
		name: "Federated",
		icon: "ic:twotone-public",
		href: "/federated",
		type: "federated",
	},
];

const store = useStore();

/* const toggleTheme = () => {
	if (store.theme === "dark") {
		store.theme = "light";

		document.getElementsByTagName("html")[0].classList.remove("dark");
	} else if (store.theme === "light") {
		store.theme = "dark";

		document.getElementsByTagName("html")[0].classList.add("dark");
	}
}; */

const logout = () => {
	store.auth.token = "";
	store.auth.url = "";
	store.auth.instance = null;
	store.client = null;
};
</script>

<template>
	<div
		class="hidden h-full dark:bg-dark-800/75 backdrop-blur-lg bg-white flex-col bg-gradient-to-b border-r dark:border-dark-700 border-gray-300 bg-light dark:dark:bg-dark-800 lg:flex">
		<div class="flex overflow-y-auto flex-col flex-1 items-center pb-4">
			<nav
				class="flex-col flex gap-y-2 grow px-2 mt-5"
				aria-label="Sidebar">
				<NavElement
					v-for="nav in navigation"
					:key="nav.name"
					:element="nav" />
			</nav>
			<!-- <button
				title="Toggle light/dark mode"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group"
				@click="toggleTheme">
				<Icon
					v-if="store.theme === 'light'"
					name="ic:outline-light-mode"
					class="w-5 h-5"
					aria-hidden="true" />
				<Icon
					v-if="store.theme === 'dark'"
					name="ic:outline-dark-mode"
					class="w-5 h-5"
					aria-hidden="true" />
			</button> -->
			<button
				title="Open settings"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group"
				@click="store.state.settingsOpen = true">
				<Icon
					name="ic:outline-settings"
					class="w-5 h-5"
					aria-hidden="true" />
			</button>
			<button
				title="Compose new post"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 bg-orange-300/20 hover:bg-orange-300/40 hover:bg-opacity-75 group"
				@click="store.state.composer = true">
				<Icon
					name="ic:outline-plus"
					class="w-5 h-5"
					aria-hidden="true" />
			</button>
			<button
				title="Logout"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 bg-red-300/20 hover:bg-red-300/40 hover:bg-opacity-75 group"
				@click="logout">
				<Icon
					name="ic:outline-logout"
					class="w-5 h-5"
					aria-hidden="true" />
			</button>
			<RouterLink
				:to="`/user/${store.auth.data?.id}`"
				class="flex justify-center items-center">
				<img
					:src="store.auth.data?.avatar ?? ''"
					class="w-9 h-9 rounded border dark:border-gray-700"
					alt="" />
				<span class="sr-only">
					Your avatar, click to visit your profile
				</span>
			</RouterLink>
		</div>
	</div>
</template>
