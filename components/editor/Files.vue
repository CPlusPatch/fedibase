<script setup lang="ts">
import { IconX, IconFile, IconMovie } from "@tabler/icons-vue";
import Button from "../button/Button.vue";

defineProps<{
	onRemove: (uuid: string) => void;
	files: {
		uuid: string;
		metadata: Entity.Attachment;
		file: File;
	}[];
}>();

const _window = window;
</script>

<template>
	<div class="flex flex-wrap gap-4 flex-row px-4 w-full mt-4">
		<div
			v-for="file in files"
			:key="file.uuid"
			class="overflow-hidden relative h-24 rounded-lg border-2">
			<img
				v-if="file.metadata.type.includes('image')"
				alt=""
				:src="_window.URL.createObjectURL(file.file)"
				class="object-cover w-full h-full" />
			<div
				v-if="file.metadata.type.includes('video')"
				class="w-20 h-full flex items-center justify-center">
				<IconMovie class="w-6 h-6" />
			</div>
			<audio
				v-if="file.metadata.type.includes('audio')"
				:src="_window.URL.createObjectURL(file.file)"
				controls
				class="w-full h-full" />
			<div v-else class="w-20 h-full flex items-center justify-center">
				<IconFile class="w-6 h-6" />
			</div>

			<Button
				theme="gray"
				class="!absolute top-2 right-2 !p-1"
				title="Remove file"
				@click="
					() => {
						onRemove(file.uuid);
					}
				">
				<IconX class="w-4 h-4" aria-hidden="true" />
			</Button>
		</div>
	</div>
</template>
