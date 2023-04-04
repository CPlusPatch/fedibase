<script setup lang="ts">
import { onUnmounted } from "vue";
import Feed, { FeedType } from "./Feed.vue";
</script>

<template>
	<div
		id="feed"
		class="flex overflow-x-hidden flex-col gap-y-6 px-6 py-4 pb-20 h-full w-full no-scroll">
		<Feed :type="FeedType.Home" />
	</div>
</template>
