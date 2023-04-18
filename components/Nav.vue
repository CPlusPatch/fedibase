<script lang="ts" setup>
import {
	IconSun,
	IconSettings,
	IconPlus,
	IconHome,
	IconUsers,
	IconWorld,
	IconHome2,
} from "@tabler/icons-vue";
import NavElement, { NavigationItem } from "./NavElement.vue";
import { store } from "../utils/store";
import { IconMoon } from "@tabler/icons-vue";
import Link from "./transitions/Link.vue";
import { IconLogout } from "@tabler/icons-vue";

const navigation: NavigationItem[] = [
	{
		name: "Home",
		icon: IconHome2,
		href: "/",
		type: "",
	},
	{
		name: "Instance",
		icon: IconUsers,
		href: "/local",
		type: "local",
	},
	{
		name: "Federated",
		icon: IconWorld,
		href: "/federated",
		type: "federated",
	},
];

const toggleTheme = () => {
	if (store.theme === "dark") {
		store.theme = "light";

		document.getElementsByTagName("html")[0].classList.remove("dark");
	} else if (store.theme === "light") {
		store.theme = "dark";

		document.getElementsByTagName("html")[0].classList.add("dark");
	}
};

const logout = () => {
	store.auth.token = "";
	store.auth.url = "";
	store.auth.instance = null;
	store.client = null;
};
</script>

<template>
	<div
		class="hidden h-full dark:bg-dark-800 bg-white flex-col bg-gradient-to-b border-r dark:border-dark-700 bg-light dark:dark:bg-dark-800 lg:flex">
		<div class="flex overflow-y-auto flex-col flex-1 items-center pb-4">
			<nav
				class="flex-col flex gap-y-2 grow px-2 mt-5"
				aria-label="Sidebar">
				<NavElement
					:element="nav"
					v-for="nav in navigation"
					:key="nav.name" />
			</nav>
			<button
				title="Toggle light/dark mode"
				@click="toggleTheme"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group">
				<IconSun
					class="w-5 h-5"
					aria-hidden="true"
					v-if="store.theme === 'light'" />
				<IconMoon
					class="w-5 h-5"
					aria-hidden="true"
					v-if="store.theme === 'dark'" />
			</button>
			<button
				title="Open settings"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group">
				<IconSettings class="w-5 h-5" aria-hidden="true" />
			</button>
			<button
				title="Compose new post"
				@click="() => (store.state.composer = true)"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 bg-orange-300/20 hover:bg-orange-300/40 hover:bg-opacity-75 group">
				<IconPlus class="w-5 h-5" aria-hidden="true" />
			</button>
			<button
				title="Logout"
				@click="logout"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 bg-red-300/20 hover:bg-red-300/40 hover:bg-opacity-75 group">
				<IconLogout class="w-5 h-5" aria-hidden="true" />
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
