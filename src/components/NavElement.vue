<script setup lang="ts">
import { ref } from "vue";
import Link from "./transitions/Link.vue";

export type NavigationItem = {
	name: string;
	icon: any;
	href: string;
	type: string;
};

let current = ref<boolean>(false);

const props = defineProps<{
	element: NavigationItem;
}>();
</script>

<template>
	<div class="flex flex-row items-center">
		<Link
			:href="props.element.href"
			class="flex justify-center items-center p-2 mx-1 text-sm font-medium rounded-md duration-200 group">
			<props.element.icon
				class="flex-shrink-0 w-5 h-5 text-gray-600 dark:text-gray-300"
				aria-hidden="true" />
			<span class="sr-only">
				Visit the {{ props.element.name }} feed
			</span>
		</Link>
	</div>
</template>
