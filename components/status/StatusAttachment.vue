<script setup lang="ts">
import { ref } from "vue";
import { decode } from "blurhash";
import Button from "../button/Button.vue";
import { PostType } from "./Status.vue";
import { useStore } from "~/utils/store";

const store = useStore();

const props = defineProps<{
	status: Entity.Status;
	media: Entity.Attachment;
	type: PostType;
}>();

const revealed = ref<boolean>(!props.status.sensitive);

const toggleRevealed = () => {
	revealed.value = !revealed.value;
};

const loaded = ref(
	props.media.blurhash == null || props.media.type !== "image"
);

const url = ref(loaded.value ? props.media.url : "");

if (props.media.blurhash) {
	const a = decode(props.media.blurhash, 1024, 1024);

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (ctx) {
		canvas.width = 1024;
		canvas.height = 1024;

		const imgData = ctx.createImageData(1024, 1024);
		imgData.data.set(a);
		ctx.putImageData(imgData, 0, 0);
		url.value = canvas.toDataURL();

		const anImage = new Image();
		anImage.onload = _ => {
			url.value = props.media.url;
			loaded.value = true;
		};

		// eslint-disable-next-line vue/no-setup-props-destructure
		anImage.src = props.media.url;
	}
}
</script>

<template>
	<div
		:class="[
			'relative rounded w-full overflow-hidden flex items-center',
			type === PostType.Small && 'h-44 w-44 border dark:border-dark-700',
			store.settings.expandImages ? '' : 'max-h-60',
		]">
		<img
			v-if="media.type === 'image' || (media.blurhash && !loaded)"
			loading="lazy"
			:class="[
				'filter duration-500 rounded object-cover',
				!revealed && 'blur-2xl',
			]"
			:src="url"
			:title="media.description ?? ''"
			:alt="media.description ?? ''"
			@click="store.viewingImage = media" />

		<audio
			v-if="media.type === 'audio'"
			:class="['duration-500 rounded']"
			:src="media.url"
			:alt="media.description ?? ''" />

		<video
			v-if="media.type === 'video' && loaded"
			:class="[
				'object-contain h-full filter duration-500 rounded mx-auto',
				!revealed && 'blur-2xl',
			]"
			:src="media.url"
			controls="true" />

		<div
			v-if="media.type === 'unknown'"
			:class="[
				'w-full h-40 filter flex items-center duration-500 border-2 border-dark-600 rounded max-h-[80vh] justify-center bg-dark-700',
				!revealed && 'blur-2xl',
			]">
			<Icon name="ic:twotone-insert-drive-file" class="w-10 h-10" />
		</div>

		<div
			v-if="status.sensitive && !revealed"
			class="flex absolute inset-0 z-20 justify-center p-3 items-center text-lg font-bold text-white"
			@click="toggleRevealed">
			{{
				status.spoiler_text !== ""
					? status.spoiler_text
					: "Image marked as sensitive"
			}}
		</div>

		<Button
			v-if="status.sensitive && revealed"
			theme="gray"
			class="!px-1 !py-1 mt-2 mr-2 !absolute top-0 right-0 !bg-opacity-70"
			title="Hide this media"
			@click="toggleRevealed">
			<Icon name="ic:outline-close" class="w-4 h-4" aria-hidden="true" />
		</Button>
	</div>
</template>
