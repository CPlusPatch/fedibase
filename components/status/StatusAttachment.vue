<script setup lang="ts">
import { ref } from "vue";
import Button from "../button/Button.vue";
import { IconX } from "@tabler/icons-vue";
import { PostType } from "./Status.vue";

const props = defineProps<{
	status: Entity.Status,
	media: Entity.Attachment,
	type: PostType,
}>();

const revealed = ref<boolean>(!props.status.sensitive);

const toggleRevealed = () => {
	revealed.value = !revealed.value;
};
</script>

<template>
	<div
		:class="['relative rounded grow-0 mx-auto overflow-hidden flex items-center',
			type === PostType.Small && 'h-44 w-44 border dark:border-dark-700']">
		<img
			loading="lazy"
			v-if="media.type === 'image'"
			:class="[
				'filter duration-500 rounded object-cover max-h-[80vh]',
				!revealed && 'filter blur-2xl',
			]"
			:src="media.url"
			:alt="media.description ?? ''" />

		<audio
			v-if="media.type === 'audio'"
			:class="[
				'filter duration-500 rounded max-h-[80vh]',
				!revealed && 'filter blur-2xl',
			]"
			:src="media.url"
			:alt="media.description ?? ''" />

		<video
			v-if="media.type === 'video'"
			:class="[
				'filter duration-500 object-contain h-full rounded',
				!revealed && 'filter blur-2xl',
			]"
			:src="media.url"
			controls="true" />

		<div
			@click="toggleRevealed"
			v-if="status.sensitive && !revealed"
			class="flex absolute inset-0 z-20 justify-center p-3 items-center text-lg font-bold text-white font-inter">
			{{
				status.spoiler_text !== ""
					? status.spoiler_text
					: "Image marked as sensitive"
			}}
		</div>

		<Button
			v-if="status.sensitive && revealed"
			@click="toggleRevealed"
			theme="gray"
			class="!px-1 !py-1 mt-2 mr-2 !absolute top-0 right-0 !bg-opacity-70"
			title="Hide this media">
			<IconX class="w-4 h-4" aria-hidden="true" />
		</Button>
	</div>
</template>