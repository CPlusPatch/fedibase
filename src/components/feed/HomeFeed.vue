<script setup lang="ts">
import Feed, { FeedType } from "./Feed.vue";
</script>

<template>
	<div
		id="homefeed"
		class="flex overflow-y-scroll overflow-x-hidden flex-col gap-y-6 px-6 py-4 pb-20 w-full h-full no-scroll mt-5">
		<Feed :type="FeedType.Home" />
	</div>
</template>
