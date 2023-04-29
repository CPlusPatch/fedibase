<script setup lang="ts">
import { ref } from "vue";
import { withEmojis } from "../../utils/functions";
import { useStore } from "../../utils/store";

const store = useStore();

const props = defineProps<{
	status: Entity.Status;
}>();

const replyStatus = ref<Entity.Status | null>(null);

if (props.status.in_reply_to_id && !replyStatus.value) {
	store.client?.getStatus(props.status.in_reply_to_id).then(res => {
		replyStatus.value = res.data;
	});
}
</script>

<template>
	<div class="inline">
		<NuxtLink
			:to="`/posts/${status.id}`"
			class="text-xs text-gray-600 hover:underline dark:text-gray-300">
			<Icon name="ic:outline-chat" class="inline mr-1 w-4 h-4" />
			Replying to
			<span
				v-if="replyStatus"
				v-html="
					withEmojis(
						replyStatus.account.display_name,
						replyStatus.account.emojis
					)
				"></span>
		</NuxtLink>
	</div>
</template>
