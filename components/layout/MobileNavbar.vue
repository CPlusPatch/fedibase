<script setup lang="ts">
import { store } from "../../utils/store";

const toggleTheme = () => {
	if (store.theme === "dark") {
		store.theme = "light";

		document.getElementsByTagName("html")[0].classList.remove("dark");
	} else if (store.theme === "light") {
		store.theme = "dark";

		document.getElementsByTagName("html")[0].classList.add("dark");
	}
};

const router = useRouter();

const themeIcon = ref(
	store.theme === "light" ? "ic:twotone-light-mode" : "ic:twotone-dark-mode"
);

const buttons = [
	{
		name: "Theme",
		icon: themeIcon.value,
		onClick: toggleTheme,
	},
	{
		name: "Home",
		icon: "ic:twotone-home",
		onClick: () => router.push("/"),
	},
	{
		name: "Notifications",
		icon: "ic:twotone-notifications",
		onClick: () => router.push("/notifications"),
	},
	{
		name: "Profile",
		icon: "ic:twotone-account-circle",
		onClick: () => false,
	},
];
</script>

<template>
	<button
		class="border-none fixed md:hidden bottom-20 right-5 flex items-center justify-center p-4 rounded-2xl shadow-lg font-medium bg-orange-100 dark:bg-orange-700 dark:text-orange-100"
		@click="store.state.composer = true">
		<Icon name="ic:twotone-edit" class="w-7 h-7" />
	</button>
	<header
		:class="[
			'fixed inset-x-0 -bottom-1 border-t border-gray-300 dark:border-dark-600 p-0 overflow-hidden rounded-t items-center justify-around grid grid-cols-4 h-16 bg-white dark:bg-dark-800 md:hidden',
		]">
		<button
			v-for="button of buttons"
			:key="button.name"
			v-ripple
			class="dark:text-white h-full w-full py-2 border-none text-black flex flex-col items-center gap-y-1"
			@click="button.onClick">
			<Icon :name="button.icon" class="h-6 w-6" aria-hidden="true" />
			<span class="text-xs font-bold font-sans">{{ button.name }}</span>
		</button>
	</header>
</template>
