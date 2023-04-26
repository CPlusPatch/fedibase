<script setup lang="ts">
import {
	IconSun,
	IconMoon,
	IconHome,
	IconBell,
	IconPencilPlus,
} from "@tabler/icons-vue";
import { store } from "../../utils/store";
import Button from "../button/Button.vue";

const toggleTheme = () => {
	if (store.theme === "dark") {
		store.theme = "light";

		document.getElementsByTagName("html")[0].classList.remove("dark");
	} else if (store.theme === "light") {
		store.theme = "dark";

		document.getElementsByTagName("html")[0].classList.add("dark");
	}
};

const composeNewPost = () => {
	store.state.composer = true;
};

const router = useRouter();
</script>

<template>
	<header
		:class="[
			'fixed inset-x-0 -bottom-1 z-[999999] border-t p-0 overflow-hidden rounded-t items-center justify-around grid grid-cols-4 h-16 bg-white border-b dark:border-gray-700 dark:bg-dark-800 md:hidden',
		]">
		<Button
			theme="gray"
			class="navbar-element navbar-link"
			@click="toggleTheme">
			<IconSun v-if="store.theme === 'light'" aria-hidden="true" />
			<IconMoon v-if="store.theme === 'dark'" aria-hidden="true" />
			<span>Theme</span>
		</Button>
		<Button
			theme="gray"
			class="navbar-element navbar-link"
			title="Visit main feed"
			@click="router.push('/')">
			<IconHome aria-hidden="true" />
			<span>Home</span>
		</Button>
		<Button
			theme="gray"
			title="Compose new post"
			class="navbar-element navbar-link"
			@click="composeNewPost">
			<IconPencilPlus aria-hidden="true" />
			<span>Compose</span>
		</Button>
		<Button
			theme="gray"
			title="Open notifications"
			class="navbar-element navbar-link"
			@click="router.push('/notifications')">
			<IconBell aria-hidden="true" />
			<span>Notifications</span>
		</Button>
	</header>
</template>
