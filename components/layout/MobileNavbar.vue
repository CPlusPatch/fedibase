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
</script>

<template>
	<header
		:class="[
			'fixed inset-x-0 -bottom-1 z-[999999] border-t p-0 overflow-hidden rounded-t items-center justify-around grid grid-cols-4 h-16 bg-white border-b dark:border-gray-700 dark:bg-dark-800 md:hidden',
		]">
		<Button theme="gray" class="element" @click="toggleTheme">
			<IconSun v-if="store.theme === 'light'" aria-hidden="true" />
			<IconMoon v-if="store.theme === 'dark'" aria-hidden="true" />
			<span>Theme</span>
		</Button>
		<Button theme="gray" class="element" title="Visit main feed">
			<RouterLink to="/">
				<IconHome aria-hidden="true" />
				<span>Home</span>
			</RouterLink>
		</Button>
		<Button
			theme="gray"
			title="Compose new post"
			class="element"
			@click="composeNewPost">
			<IconPencilPlus aria-hidden="true" />
			<span>Compose</span>
		</Button>
		<Button theme="gray" title="Open notifications" class="element">
			<RouterLink to="/notifications">
				<IconBell aria-hidden="true" />
				<span>Notifications</span>
			</RouterLink>
		</Button>
	</header>
</template>

<style scoped lang="postcss">
.element {
	@apply !px-0 !py-0 !p-3 h-full !rounded-none grow dark:hover:!bg-dark-600 hover:!bg-gray-300 !bg-transparent !border-none !shadow-none !bg-white dark:!bg-transparent;
}

.element a,
.element {
	@apply flex items-center justify-center text-xs flex-col gap-y-1;
}
</style>
