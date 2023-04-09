<script setup lang="ts">
import { ref } from "vue";
import { store } from "../../utils/store";
import PostEditor from "../editor/PostEditor.vue";
import Conversation from "../feed/Conversation.vue";
import { v4 } from "uuid";

const uuid = ref<string>(v4());

const reRender = () => {
	uuid.value = v4();
};
</script>

<template>
	<Conversation
		v-if="store.viewingConversation"
		:key="store.viewingConversation"
		:close-button="true"
		:id="store.viewingConversation"
		:on-close="
			() => {
				store.viewingConversation = '';
			}
		" />
	<div v-else class="p-3">
		<PostEditor :key="uuid" :close-button="true" :re-render="reRender" />
	</div>
</template>
