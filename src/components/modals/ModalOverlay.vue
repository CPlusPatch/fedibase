<script setup lang="ts">
import { TransitionChild, DialogBackdrop } from '@headlessui/vue';
</script>

<template>
	<TransitionChild appear enter="ease-in duration-200" enter-from="opacity-0 backdrop-blur-none"
		enter-to="opacity-100 backdrop-blur-lg" entered="backdrop-blur-lg" leave="ease-out duration-200" leave-from="opacity-100 backdrop-blur-lg"
		leave-to="opacity-0 backdrop-blur-none" class="fixed inset-0 transition-all bg-gray-500/75 dark:bg-dark-700/75">
	</TransitionChild>
</template>