<script setup lang="ts">
import { Entity } from "megalodon";
import StatusAttachment from "./StatusAttachment.vue";

const props = defineProps<{
	status: Entity.Status;
}>();
</script>

<template>
	<div
		v-if="status.media_attachments.length > 0"
		:class="[
			'grid gap-3 w-full h-full mt-2',
			status.media_attachments.length === 2 && 'grid-cols-2',
			status.media_attachments.length > 2 && 'grid-cols-3',
		]">
		<StatusAttachment
			v-for="attachment in status.media_attachments"
			:key="attachment.id"
			:status="status"
			:media="attachment" />
	</div>
</template>
