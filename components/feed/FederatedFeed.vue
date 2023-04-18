<script setup lang="ts">
import Feed, { FeedType } from "./Feed.vue";
</script>

<template>
	<div
		id="feed"
		class="flex overflow-y-scroll overflow-x-hidden flex-col px-2 py-4 pb-20 w-full h-full no-scroll mt-10">
		<Feed :type="FeedType.Federated" />
	</div>
</template>
