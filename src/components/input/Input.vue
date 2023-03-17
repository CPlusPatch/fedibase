<script setup lang="ts">

interface InputProps {
	loading: boolean;
	name: string;
	class?: string;
}

const props = defineProps<InputProps>();

</script>

<template>
	<input :name="props.name" :disabled="props.loading" :class="[
				'block px-3 py-2 w-full placeholder-gray-400 bg-white rounded-md border border-gray-300 shadow-sm duration-200 appearance-none outline-none dark:text-gray-100 dark:bg-dark-800 disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm',
				props.class]" v-bind="$attrs" />
</template>