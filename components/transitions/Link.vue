<template>
	<a v-bind="$attrs" :href="props.href" @click="handleClick">
		<slot />
	</a>
</template>

<script setup lang="ts">
import { useStore } from "../../utils/store";

const store = useStore();

const props = defineProps<{
	sidebar?: string;
	href: string;
}>();

const handleClick = (e: MouseEvent) => {
	if (!e.ctrlKey && !e.metaKey) {
		if (props.sidebar) {
			e.preventDefault();

			store.state.postViewer = true;
		} else {
			store.state.notifications = false;
			store.state.postViewer = false;
		}
	}
};
</script>
