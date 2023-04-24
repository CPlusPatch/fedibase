<script setup lang="ts">
import Feed, { FeedType } from "../feed/Feed.vue";
</script>

<template>
	<ul
		id="feed"
		class="flex overflow-x-hidden flex-col gap-y-6 px-6 py-4 pb-20 h-full w-full no-scroll">
		<Feed :type="FeedType.Notifications" />
	</ul>
</template>
