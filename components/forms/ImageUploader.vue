<script setup lang="ts">
const emit = defineEmits<{
	(event: "upload", files: FileList | null): void;
}>();

defineProps<{
	image: string;
	isUploading: boolean;
}>();

const id = (Math.random() * 100000000000000000).toString();

const clickFileInput = () => {
	(document.getElementById(id) as HTMLInputElement).click();
};
</script>

<template>
	<div
		v-bind="$attrs"
		class="flex items-center justify-center gap-x-3 relative rounded overflow-hidden group">
		<input
			:id="id"
			accept="image/*"
			type="file"
			class="hidden"
			@change="
				emit('upload', ($event.target as HTMLInputElement).files)
			" />
		<div
			class="absolute inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm text-gray-800 group-hover:opacity-100 opacity-0 flex duration-200 items-center justify-center"
			@click="!isUploading && clickFileInput()">
			<Icon name="ic:round-upload" class="w-8 h-8" />
		</div>
		<div
			v-if="isUploading"
			class="absolute inset-0 bg-gray-500 text-gray-800 flex duration-200 items-center justify-center">
			<Spinner theme="gray" class="w-6 h-6" />
		</div>
		<img
			v-if="image"
			:src="image"
			class="h-full w-full object-cover"
			aria-hidden="true" />
		<Icon v-else name="ic:round-hide-image" class="text-gray-400 w-6 h-6" />
	</div>
</template>
