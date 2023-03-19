<script setup lang="ts">
import { store } from "../../utils/store";
import Conversation from "../feed/Conversation.vue";
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
</template>
