<script setup lang="ts">
import Feed, { FeedType } from "./Feed.vue";
</script>

<template>
	<div
		id="feed"
		class="flex overflow-x-hidden flex-col py-4 pb-20 h-full w-full no-scroll">
		<Feed :type="FeedType.Home" />
	</div>
</template>
