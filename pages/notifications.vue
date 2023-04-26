<script setup lang="ts">
import Feed, { FeedType } from "~/components/feed/Feed.vue";
</script>

<template>
	<ul
		id="feed"
		class="flex overflow-x-hidden flex-col py-4 pb-20 h-full w-full no-scroll">
		<Feed :type="FeedType.Notifications" />
	</ul>
</template>
