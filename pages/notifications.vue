<script setup lang="ts">
import Feed, { FeedType } from "~/components/feed/Feed.vue";
</script>

<template>
	<Feed :type="FeedType.Notifications" />
</template>
