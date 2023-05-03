<script setup lang="ts">
import Feed, { FeedType } from "~/components/feed/Feed.vue";
</script>

<template>
	<FeedWrapper>
		<Feed :type="FeedType.Local" />
	</FeedWrapper>
</template>
