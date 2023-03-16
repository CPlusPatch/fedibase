<template>
	<a v-bind="$attrs" @click="handleClick" :href="props.href">
		<slot />
	</a>
</template>

<script setup lang="ts">
import { store } from '../../utils/store';

const props = defineProps<{
	sidebar?: string;
	href: string;
}>()

const handleClick = (e: MouseEvent) => {
	if (!e.ctrlKey && !e.metaKey) {
		e.preventDefault();

		if (props.sidebar) {
			store.state.postViewer = true;
			store.viewingConversation = props.sidebar
		} else {
			history.pushState(null, "", props.href);
			store.path = props.href;
		}
	}
};
</script>
