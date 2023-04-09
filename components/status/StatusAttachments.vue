<script setup lang="ts">
import { Entity } from "megalodon";
import StatusAttachment from "./StatusAttachment.vue";
import { PostType } from "./Status.vue";

const props = defineProps<{
	status: Entity.Status,
	type: PostType
}>();
</script>

<template>
	<div
		v-if="status.media_attachments.length > 0"
		:class="[
			'grid gap-3 w-full h-full mt-2 justify-start',
			status.media_attachments.length === 2 && 'grid-cols-2 !justify-center',
			status.media_attachments.length > 2 && 'grid-cols-3 !justify-center',
		]">
		<StatusAttachment
			v-for="attachment in status.media_attachments"
			:type="type"
			:key="attachment.id"
			:status="status"
			:media="attachment" />
	</div>
</template>
