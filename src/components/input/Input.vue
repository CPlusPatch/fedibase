<script setup lang="ts">
import { IconUser } from "@tabler/icons-vue";

interface InputProps {
	loading?: boolean;
	name: string;
	class?: string;
	icon?: any;
}

const props = defineProps<InputProps>();
</script>

<template>
	<div class="relative">
		<input
			:name="props.name"
			:disabled="props.loading"
			:class="[
				'block pr-3 py-2 focus:shadow-xl w-full pt-[0.6rem] pl-8 placeholder-gray-500 bg-white rounded-md border border-gray-300 shadow-sm duration-200 appearance-none outline-none dark:text-gray-100 dark:bg-dark-800 dark:border-dark-700 disabled:bg-gray-100 focus:outline-none sm:text-sm',
				props.class,
			]"
			v-bind="$attrs" />
		<div v-if="icon" class="absolute left-2 inset-y-0 flex items-center">
			<component :is="icon" class="w-5 h-5 text-gray-400" />
		</div>
	</div>
</template>
