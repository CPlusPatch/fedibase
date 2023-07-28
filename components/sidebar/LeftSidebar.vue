<script setup lang="ts">
import { ref } from "vue";
import { v4 } from "uuid";
import PostEditor from "../editor/PostEditor.vue";
import NotificationsFeed from "../feed/NotificationsFeed.vue";

const uuid = ref<string>(v4());

// Hacky method to force the re-render of the post,
// thereby cleaning the post state
const reRender = () => {
	uuid.value = v4();
};

const { width } = useWindowSize();
</script>

<template>
	<div class="px-3 flex-col flex gap-y-4 pt-10">
		<PostEditor :key="uuid" :close-button="true" :re-render="reRender" />

		<div
			v-if="width >= 768 && width < 1280"
			class="hidden overflow-x-hidden p-4 md:flex xl:hidden dark:bg-dark-800 rounded-md border dark:border-dark-700">
			<NotificationsFeed :title="true" />
		</div>
	</div>
</template>
