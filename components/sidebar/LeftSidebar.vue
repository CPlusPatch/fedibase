<script setup lang="ts">
import { ref } from "vue";
import { v4 } from "uuid";
import { store } from "../../utils/store";
import PostEditor from "../editor/PostEditor.vue";
import Conversation from "../feed/Conversation.vue";
import NotificationsFeed from "../feed/NotificationsFeed.vue";

const uuid = ref<string>(v4());

const reRender = () => {
	uuid.value = v4();
};
</script>

<template>
	<Conversation
		v-if="store.viewingConversation"
		:id="store.viewingConversation"
		:key="store.viewingConversation"
		:close-button="true"
		:on-close="
			() => {
				store.viewingConversation = '';
			}
		" />
	<div v-else class="px-3 flex-col flex gap-y-4 pt-10">
		<PostEditor :key="uuid" :close-button="true" :re-render="reRender" />

		<div
			class="hidden overflow-x-hidden p-4 md:flex xl:hidden dark:bg-dark-800 rounded-md border dark:border-dark-700">
			<NotificationsFeed :title="true" />
		</div>
	</div>
</template>
