<script setup lang="ts">
import { Entity } from "megalodon";
import StatusAttachment from "./StatusAttachment.vue";
import { PostType } from "./Status.vue";

defineProps<{
	status: Entity.Status;
	type: PostType;
}>();
</script>

<template>
	<div
		v-if="status.media_attachments.length > 0"
		:class="['flex flex-col gap-3 w-full h-full mt-2']">
		<StatusAttachment
			v-for="attachment in status.media_attachments"
			:key="attachment.id"
			:type="type"
			:status="status"
			:media="attachment" />
	</div>
</template>
