<script setup lang="ts"></script>

<template>
	<button
		v-bind="$attrs"
		class="gap-x-2 flex justify-center static hover:animate-hithere">
		<slot />
	</button>
</template>
