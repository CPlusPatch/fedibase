<script setup lang="ts">
import { ref } from "vue";

export type NavigationItem = {
	name: string;
	icon: any;
	href: string;
	type: string;
};

const props = defineProps<{
	element: NavigationItem;
}>();

const active = ref(window.location.pathname === props.element.href);

watch(
	() => window.location.pathname,
	() => {
		active.value = window.location.pathname === props.element.href;
	}
);
</script>

<template>
	<NuxtLink
		:to="props.element.href"
		:class="[
			'flex justify-center items-center p-2.5 mx-1 text-sm font-medium rounded-md group hover:translate-x-1 duration-200 ease-in-out',
			active && 'dark:bg-dark-500/30 bg-gray-500/30',
		]">
		<props.element.icon
			class="flex-shrink-0 w-5 h-5 text-black dark:text-[#fffbded6]"
			aria-hidden="true" />
		<span class="sr-only"> Visit the {{ props.element.name }} feed </span>
	</NuxtLink>
</template>
