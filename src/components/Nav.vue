<script lang="ts" setup>
import { IconSun, IconSettings, IconPlus, IconHome, IconUsers, IconWorld } from "@tabler/icons-vue";
import NavElement, { NavigationItem } from "./NavElement.vue";
import { store } from "../utils/store";
import { IconMoon } from "@tabler/icons-vue";
import Link from "./transitions/Link.vue";

const navigation: NavigationItem[] = [
	{
		name: "Home",
		icon: IconHome,
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
		store.theme = "light"

		document.getElementsByTagName("html")[0].classList.remove("dark");
	} else if (store.theme === "light") {
		store.theme = "dark"

		document.getElementsByTagName("html")[0].classList.add("dark");
	}
}
</script>

<template>
	<div
		class="hidden h-full dark:bg-dark-800 bg-white flex-col bg-gradient-to-b border-r dark:border-gray-700 bg-light dark:dark:bg-dark-800 lg:flex">
		<div class="flex overflow-y-auto flex-col flex-1 items-center pt-5 pb-4">
			<Link href="/" class="flex flex-shrink-0 justify-center items-center px-2">
				<img :src="store.auth.instance?.thumbnail ?? ''" class="w-8 h-8 rounded" alt="" />
				<span class="sr-only">{{ store.auth.instance?.title }}</span>
			</Link>
			<nav class="flex-1 px-2 mt-5 space-y-1" aria-label="Sidebar" >
				<div v-for="nav in navigation" :key="nav.name">
					<NavElement :element="nav" />
				</div>
			</nav>
			<button
				title="Toggle light/dark mode"
				@click="toggleTheme"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group">
				<IconSun class="w-5 h-5" aria-hidden="true" v-if="store.theme === 'light'" />
				<IconMoon class="w-5 h-5" aria-hidden="true" v-if="store.theme === 'dark'" />
			</button>
			<button
				title="Open settings"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group">
				<IconSettings class="w-5 h-5" aria-hidden="true" />
			</button>
			<button title="Compose new post"
				@click="() => store.state.composer = true"
				class="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 bg-orange-300/20 hover:bg-orange-300/40 hover:bg-opacity-75 group">
				<IconPlus class="w-5 h-5" aria-hidden="true" />
				<span class="sr-only">Compose new post</span>
			</button>
			<Link :href="`/users/${store.auth.data?.id}`" class="flex justify-center items-center">
				<img :src="store.auth.data?.avatar ?? ''" class="w-9 h-9 rounded border dark:border-gray-700" alt="" />
				<span class="sr-only">
					Your avatar, click to visit your profile
				</span>
			</Link>
		</div>
	</div>
</template>