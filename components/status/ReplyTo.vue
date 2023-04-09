<script setup lang="ts">
import { IconMessage } from "@tabler/icons-vue";
import Link from "../transitions/Link.vue";
import { ref } from "vue";
import { withEmojis } from "../../utils/functions";
import { store } from "../../utils/store";

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
		<Link
			:href="`/posts/${status.id}`"
			:sidebar="status.id"
			class="text-xs text-gray-600 hover:underline dark:text-gray-300">
			<IconMessage class="inline mr-1 w-4 h-4" />
			Replying to
			<span
				v-if="replyStatus"
				v-html="
					withEmojis(
						replyStatus.account.display_name,
						replyStatus.account.emojis
					)
				"></span>
		</Link>
	</div>
</template>
