<template>
	<a v-bind="$attrs" :href="props.href" @click="handleClick">
		<slot />
	</a>
</template>

<script setup lang="ts">
import { store } from "../../utils/store";

const props = defineProps<{
	sidebar?: string;
	href: string;
}>();

const handleClick = (e: MouseEvent) => {
	if (!e.ctrlKey && !e.metaKey) {
		if (props.sidebar) {
			e.preventDefault();

			store.state.postViewer = true;
			store.viewingConversation = props.sidebar;
		} else {
			store.state.notifications = false;
			store.state.postViewer = false;
		}
	}
};
</script>
